// Utility để tối ưu hóa hình ảnh
export class ImageOptimizer {
  private static cache = new Map<string, string>();

  // Tạo thumbnail từ image file
  static createThumbnail(
    file: File | string, 
    maxWidth: number = 300, 
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Tính toán kích thước mới giữ nguyên tỷ lệ
        const aspectRatio = img.height / img.width;
        const newWidth = Math.min(maxWidth, img.width);
        const newHeight = newWidth * aspectRatio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Vẽ hình ảnh đã resize
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // Chuyển thành base64
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(thumbnailDataUrl);
      };

      img.onerror = reject;

      if (typeof file === 'string') {
        img.src = file;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Tạo blur placeholder
  static createBlurPlaceholder(src: string, size: number = 10): Promise<string> {
    const cacheKey = `blur_${src}_${size}`;
    
    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey)!);
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Vẽ hình ảnh rất nhỏ để tạo hiệu ứng blur
        ctx?.drawImage(img, 0, 0, size, size);
        
        const blurDataUrl = canvas.toDataURL('image/jpeg', 0.1);
        this.cache.set(cacheKey, blurDataUrl);
        resolve(blurDataUrl);
      };

      img.onerror = reject;
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }

  // Preload images
  static preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
    const promises = sources.map(src => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    });

    return Promise.all(promises);
  }

  // Check if image format is supported
  static isWebPSupported(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Get optimal image format
  static getOptimalFormat(): string {
    if (this.isWebPSupported()) {
      return 'webp';
    }
    return 'jpeg';
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear();
  }
}

// Intersection Observer cho lazy loading
export class LazyLoadObserver {
  private observer: IntersectionObserver;
  private callbacks = new Map<Element, () => void>();

  constructor(options: IntersectionObserverInit = {}) {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback();
            this.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });
  }

  observe(element: Element, callback: () => void): void {
    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.callbacks.clear();
  }
}
