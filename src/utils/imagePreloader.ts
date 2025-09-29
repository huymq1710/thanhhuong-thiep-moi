import { useCallback } from 'react';
import { MobileOptimizer } from './mobileOptimization';
import images from '@/layout/Gallery/Images';

interface PreloadOptions {
  quality?: number;
  priority?: boolean;
  sizes?: string[];
}

class ImagePreloader {
  private static preloadedImages = new Set<string>();
  private static maxConcurrent = 2; // Giới hạn số ảnh load đồng thời

  // Preload một ảnh với options
  static preloadImage(url: string, options: PreloadOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(url)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;

      // Thêm responsive preload nếu có sizes
      if (options.sizes && options.sizes.length > 0) {
        link.setAttribute('imagesizes', options.sizes.join(', '));
      }

      link.onload = () => {
        this.preloadedImages.add(url);
        document.head.removeChild(link);
        resolve();
      };

      link.onerror = () => {
        document.head.removeChild(link);
        reject(new Error(`Failed to preload image: ${url}`));
      };

      document.head.appendChild(link);
    });
  }

  // Preload multiple images với priority queue
  static async preloadImages(
    urls: Array<{ url: string; options?: PreloadOptions }>
  ): Promise<void> {
    // Sắp xếp theo priority (priority images trước)
    const sortedUrls = urls.sort((a, b) => {
      const aPriority = a.options?.priority ? 1 : 0;
      const bPriority = b.options?.priority ? 1 : 0;
      return bPriority - aPriority;
    });

    // Process với concurrency limit
    const batches = this.chunkArray(sortedUrls, this.maxConcurrent);
    
    for (const batch of batches) {
      const promises = batch.map(({ url, options }) => 
        this.preloadImage(url, options || {}).catch(err => 
          console.warn('Preload failed:', url, err)
        )
      );
      
      await Promise.allSettled(promises);
    }
  }

  // Utility để chia array thành chunks
  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Clear preloaded images (để tránh memory leaks)
  static clearCache(): void {
    this.preloadedImages.clear();
  }

  // Check if image is already preloaded
  static isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }

  // Get cache info
  static getCacheInfo(): { size: number; urls: string[] } {
    return {
      size: this.preloadedImages.size,
      urls: Array.from(this.preloadedImages)
    };
  }

  // Mobile-optimized critical image preloading
  static async preloadCriticalImages(): Promise<void> {
    const settings = MobileOptimizer.getOptimalSettings();
    const criticalCount = settings.isMobile ? 3 : 6;
    
    // Chỉ preload những ảnh đầu tiên với quality thấp
    const criticalImages = images.slice(0, criticalCount);
    
    const preloadPromises = criticalImages.map(image => 
      this.preloadImage(image.source, { 
        quality: Math.min(settings.quality, 30), 
        priority: true 
      }).catch(() => {}) // Silent fail
    );
    
    await Promise.allSettled(preloadPromises);
  }

  // Preload next batch với mobile optimization
  static async preloadNextBatch(startIndex: number, batchSize: number = 3): Promise<void> {
    const settings = MobileOptimizer.getOptimalSettings();
    
    // Giảm batchSize cho mobile và slow connection
    if (settings.isMobile || settings.isSlowConnection) {
      batchSize = Math.min(batchSize, 2);
    }
    
    const nextImages = images.slice(startIndex, startIndex + batchSize);
    
    const preloadPromises = nextImages.map(image =>
      this.preloadImage(image.source, { 
        quality: settings.quality,
        priority: false 
      }).catch(() => {}) // Silent fail
    );
    
    await Promise.allSettled(preloadPromises);
  }
}

// Hook để preload images thông minh
export const useImagePreloader = () => {
  const preloadCriticalImages = useCallback(async (
    imageUrls: string[],
    options: { 
      maxPreload?: number;
      quality?: number;
      responsive?: boolean;
    } = {}
  ) => {
    const { maxPreload = 3, quality = 60, responsive = true } = options;
    
    // Chỉ preload một số ảnh đầu tiên
    const criticalImages = imageUrls.slice(0, maxPreload).map((url, index) => ({
      url: getOptimizedUrl(url, 300, quality),
      options: {
        priority: index < 2, // 2 ảnh đầu có priority cao nhất
        quality,
        sizes: responsive ? ['300w', '600w', '900w'] : undefined
      }
    }));

    await ImagePreloader.preloadImages(criticalImages);
  }, []);

  const preloadNextImages = useCallback(async (
    currentIndex: number,
    allImages: string[],
    lookahead: number = 2
  ) => {
    const nextImages = allImages
      .slice(currentIndex + 1, currentIndex + 1 + lookahead)
      .map(url => ({
        url: getOptimizedUrl(url, 150, 50), // Thumbnail size với quality thấp
        options: {
          priority: false,
          quality: 50
        }
      }));

    if (nextImages.length > 0) {
      await ImagePreloader.preloadImages(nextImages);
    }
  }, []);

  return {
    preloadCriticalImages,
    preloadNextImages,
    isPreloaded: ImagePreloader.isPreloaded,
    getCacheInfo: ImagePreloader.getCacheInfo,
    clearCache: ImagePreloader.clearCache
  };
};

// Utility function (giả sử đã có từ Images.ts)
const getOptimizedUrl = (originalUrl: string, width: number, quality: number): string => {
  if (typeof window !== 'undefined' && 
      (window.location.hostname.includes('vercel.app') || 
       window.location.hostname.includes('netlify.app'))) {
    
    return `/_next/image?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}`;
  }
  
  return originalUrl;
};

// Hook để detect connection speed và adjust preloading
export const useConnectionAwarePreloading = () => {
  const getConnectionInfo = useCallback(() => {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      return { effectiveType: '4g', saveData: false };
    }

    return {
      effectiveType: connection.effectiveType || '4g',
      saveData: connection.saveData || false,
      downlink: connection.downlink || 10
    };
  }, []);

  const shouldPreload = useCallback(() => {
    const { effectiveType, saveData, downlink } = getConnectionInfo();
    
    // Không preload nếu user bật save data
    if (saveData) return false;
    
    // Chỉ preload với connection tốt
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return false;
    
    // Preload ít hơn với connection chậm
    if (effectiveType === '3g' || (downlink && downlink < 2)) return 'limited';
    
    return 'full';
  }, [getConnectionInfo]);

  return {
    shouldPreload,
    getConnectionInfo
  };
};

// Initialize mobile preloading
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const settings = MobileOptimizer.getOptimalSettings();
    if (!settings.isSlowConnection) {
      ImagePreloader.preloadCriticalImages().catch(console.warn);
    }
  }, 1000); // Delay để không block initial render
}

export default ImagePreloader;