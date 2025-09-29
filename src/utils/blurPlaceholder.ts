// Utility để generate blur placeholder cho images
export class BlurPlaceholderGenerator {
  private static cache = new Map<string, string>();

  // Generate blur placeholder từ image URL
  static async generateBlurDataURL(
    imageUrl: string, 
    width: number = 8, 
    height: number = 12,
    quality: number = 10
  ): Promise<string> {
    const cacheKey = `${imageUrl}_${width}_${height}_${quality}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = width;
      canvas.height = height;

      // Tạo một image element để load ảnh gốc
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const blurDataURL = await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          try {
            // Vẽ ảnh với kích thước nhỏ (tạo blur effect)
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert thành base64 với chất lượng thấp
            const dataURL = canvas.toDataURL('image/jpeg', quality / 100);
            resolve(dataURL);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });

      this.cache.set(cacheKey, blurDataURL);
      return blurDataURL;
      
    } catch (error) {
      console.warn('Failed to generate blur placeholder:', error);
      
      // Fallback: tạo gradient placeholder
      const fallbackBlur = this.generateGradientPlaceholder(width, height);
      this.cache.set(cacheKey, fallbackBlur);
      return fallbackBlur;
    }
  }

  // Generate gradient placeholder nếu không thể tạo blur từ ảnh gốc
  private static generateGradientPlaceholder(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width;
    canvas.height = height;
    
    // Tạo gradient đẹp mắt
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f6f7fb');
    gradient.addColorStop(0.5, '#e9ecef');
    gradient.addColorStop(1, '#dee2e6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  // Pregenerate blur placeholders cho tất cả images
  static async pregenerateBlurPlaceholders(imageUrls: string[]): Promise<Map<string, string>> {
    const blurMap = new Map<string, string>();
    
    const promises = imageUrls.map(async (url) => {
      try {
        const blurDataURL = await this.generateBlurDataURL(url);
        blurMap.set(url, blurDataURL);
      } catch (error) {
        console.warn(`Failed to generate blur for ${url}:`, error);
      }
    });
    
    await Promise.all(promises);
    return blurMap;
  }

  // Clear cache để tránh memory leaks
  static clearCache(): void {
    this.cache.clear();
  }

  // Get cache size (for debugging)
  static getCacheSize(): number {
    return this.cache.size;
  }
}

// Hook để sử dụng blur placeholder
import { useState, useEffect } from 'react';

export const useBlurPlaceholder = (imageUrl: string) => {
  const [blurDataURL, setBlurDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    setIsGenerating(true);
    
    BlurPlaceholderGenerator.generateBlurDataURL(imageUrl)
      .then(setBlurDataURL)
      .catch(() => setBlurDataURL(''))
      .finally(() => setIsGenerating(false));
  }, [imageUrl]);

  return { blurDataURL, isGenerating };
};