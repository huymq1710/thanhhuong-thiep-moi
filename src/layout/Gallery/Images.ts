import image01 from '@/assets/images/01.webp'
import image02 from '@/assets/images/02.webp'
import image08 from '@/assets/images/08.webp'
import image07 from '@/assets/images/07.webp'

export interface ImageItem {
  alt: string;
  source: string;
  width: number;
  height: number;
  priority?: boolean; // Đánh dấu ảnh ưu tiên load trước
  blurDataURL?: string; // Base64 blur placeholder
}

// Detect device type và connection speed
const getDeviceInfo = () => {
  if (typeof window === 'undefined') return { isMobile: false, isSlowConnection: false };
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check for slow connection - safely handle the connection API
  let isSlowConnection = false;
  try {
    const nav = navigator as any;
    if (nav.connection) {
      isSlowConnection = nav.connection.effectiveType === '2g' || 
                        nav.connection.effectiveType === 'slow-2g';
    }
  } catch (e) {
    // Fallback: assume slow connection on mobile if no API available
    isSlowConnection = isMobile;
  }
  
  return { isMobile, isSlowConnection };
};

// Utility để tạo URL optimized cho mobile và slow connection
export const getOptimizedImageUrl = (
  originalUrl: string, 
  width: number, 
  quality: number = 75
): string => {
  const { isMobile, isSlowConnection } = getDeviceInfo();
  
  // Giảm quality cho mobile và slow connection
  let optimizedQuality = quality;
  if (isMobile) {
    optimizedQuality = Math.min(quality, 50); // Max 50% cho mobile
  }
  if (isSlowConnection) {
    optimizedQuality = Math.min(optimizedQuality, 35); // Max 35% cho slow connection
  }
  
  // Nếu đang trong production (Vercel)
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    // Sử dụng Vercel Image Optimization
    return `/_next/image?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${optimizedQuality}`;
  }
  
  // Local development - trả về ảnh gốc
  return originalUrl;
};

const images: ImageItem[] = [   /* 이미지 경로를 리스트로 저장 */
  {
    alt: 'image01',
    source: image01,
    width: 640,
    height: 960,
    priority: true // 4 ảnh sẽ được load trước
  },
  {
    alt: 'image08',
    source: image08,
    width: 640,
    height: 960,
    priority: true
  },
  {
    alt: 'image07',
    source: image07,
    width: 640,
    height: 960,
    priority: true
  },
  {
    alt: 'image02',
    source: image02,
    width: 640,
    height: 960,
    priority: true
  },
];

export default images;