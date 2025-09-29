// Mobile optimization utilities
export class MobileOptimizer {
  private static loadingImages = new Set<string>();
  private static maxConcurrentLoads = 3; // Giới hạn số ảnh load đồng thời
  private static loadQueue: Array<() => void> = [];

  static isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static isSlowConnection(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const nav = navigator as any;
      if (nav.connection) {
        return nav.connection.effectiveType === '2g' || 
               nav.connection.effectiveType === 'slow-2g' ||
               nav.connection.downlink < 1.5; // Less than 1.5 Mbps
      }
    } catch (e) {
      // Fallback - assume slow on mobile
      return this.isMobile();
    }
    
    return false;
  }

  static getOptimalSettings() {
    const isMobile = this.isMobile();
    const isSlowConnection = this.isSlowConnection();
    const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    let quality = 75;
    let maxWidth = 800;
    let maxConcurrent = 6;

    if (isMobile) {
      quality = 50;
      maxWidth = 400;
      maxConcurrent = 3;
    }

    if (isSlowConnection) {
      quality = Math.min(quality, 35);
      maxWidth = Math.min(maxWidth, 300);
      maxConcurrent = 2;
    }

    this.maxConcurrentLoads = maxConcurrent;

    return {
      quality,
      maxWidth,
      maxConcurrent,
      pixelRatio: Math.min(pixelRatio, 2), // Cap pixel ratio
      isMobile,
      isSlowConnection
    };
  }

  // Queue system để control image loading
  static async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const tryLoad = () => {
        if (this.loadingImages.size >= this.maxConcurrentLoads) {
          // Add to queue
          this.loadQueue.push(tryLoad);
          return;
        }

        // Start loading
        this.loadingImages.add(src);
        const img = new Image();
        
        const cleanup = () => {
          this.loadingImages.delete(src);
          // Process next in queue
          if (this.loadQueue.length > 0) {
            const nextLoader = this.loadQueue.shift();
            if (nextLoader) {
              setTimeout(nextLoader, 0);
            }
          }
        };

        img.onload = () => {
          cleanup();
          resolve(img);
        };

        img.onerror = () => {
          cleanup();
          reject(new Error(`Failed to load image: ${src}`));
        };

        img.src = src;
      };

      tryLoad();
    });
  }

  // Memory cleanup cho images không còn visible
  static cleanupInvisibleImages(visibleSources: string[]) {
    // Remove từ loading queue những ảnh không còn visible
    // For now, keep simple implementation
    
    // Có thể thêm logic để unload images không còn cần thiết
    // Nhưng cần cẩn thận với browser caching
    if (visibleSources.length === 0 && this.loadQueue.length > 5) {
      // Clear queue if no visible sources and queue is too long
      this.loadQueue = [];
    }
  }

  // Get memory info if available
  static getMemoryInfo() {
    if (typeof window === 'undefined') return null;
    
    try {
      const nav = navigator as any;
      if (nav.deviceMemory) {
        return {
          deviceMemory: nav.deviceMemory, // GB
          isLowMemory: nav.deviceMemory <= 2 // 2GB or less is considered low
        };
      }
    } catch (e) {
      // Not available
    }
    
    return null;
  }

  // Adjust settings based on memory
  static getMemoryOptimizedSettings() {
    const baseSettings = this.getOptimalSettings();
    const memoryInfo = this.getMemoryInfo();
    
    if (memoryInfo?.isLowMemory) {
      return {
        ...baseSettings,
        quality: Math.min(baseSettings.quality, 30),
        maxWidth: Math.min(baseSettings.maxWidth, 200),
        maxConcurrent: Math.min(baseSettings.maxConcurrent, 1)
      };
    }
    
    return baseSettings;
  }
}

// Performance monitor để track loading performance
export class ImageLoadMonitor {
  private static loadTimes: number[] = [];
  private static failureCount = 0;
  private static totalLoads = 0;

  static recordLoad(startTime: number, success: boolean) {
    this.totalLoads++;
    
    if (success) {
      const loadTime = performance.now() - startTime;
      this.loadTimes.push(loadTime);
      
      // Keep only recent 20 load times
      if (this.loadTimes.length > 20) {
        this.loadTimes.shift();
      }
    } else {
      this.failureCount++;
    }
  }

  static getAverageLoadTime(): number {
    if (this.loadTimes.length === 0) return 0;
    return this.loadTimes.reduce((a, b) => a + b, 0) / this.loadTimes.length;
  }

  static getFailureRate(): number {
    if (this.totalLoads === 0) return 0;
    return this.failureCount / this.totalLoads;
  }

  static shouldReduceQuality(): boolean {
    const avgLoadTime = this.getAverageLoadTime();
    const failureRate = this.getFailureRate();
    
    // Reduce quality if average load time > 3 seconds or failure rate > 10%
    return avgLoadTime > 3000 || failureRate > 0.1;
  }

  static reset() {
    this.loadTimes = [];
    this.failureCount = 0;
    this.totalLoads = 0;
  }
}