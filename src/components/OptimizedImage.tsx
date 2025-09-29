import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { useBlurPlaceholder } from '@/utils/blurPlaceholder';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

// Styled components
const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderDiv = styled.div<{ blurDataURL?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  
  ${props => props.blurDataURL ? `
    background-image: url(${props.blurDataURL});
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    transform: scale(1.1); /* Slight scale to hide blur edges */
  ` : `
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  `}

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const StyledImage = styled.img<{ isLoaded: boolean }>`
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.isLoaded ? 1 : 0};
`;

// Detect mobile device và connection
const getDeviceCapabilities = () => {
  if (typeof window === 'undefined') return { isMobile: false, isSlowConnection: false, pixelRatio: 1 };
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const pixelRatio = window.devicePixelRatio || 1;
  
  let isSlowConnection = false;
  try {
    const nav = navigator as any;
    if (nav.connection) {
      isSlowConnection = nav.connection.effectiveType === '2g' || 
                        nav.connection.effectiveType === 'slow-2g';
    }
  } catch (e) {
    isSlowConnection = isMobile; // Fallback
  }
  
  return { isMobile, isSlowConnection, pixelRatio };
};

// Utility để generate responsive image URLs với optimization cho mobile
const generateImageSizes = (originalSrc: string, width: number, quality?: number) => {
  const { isMobile, isSlowConnection, pixelRatio } = getDeviceCapabilities();
  
  // Tính toán kích thước tối ưu
  let optimalWidth = width;
  let optimalQuality = quality || 75;
  
  if (isMobile) {
    optimalWidth = Math.min(width, 300); // Max 300px cho mobile
    optimalQuality = Math.min(optimalQuality, 50); // Max 50% quality
  }
  
  if (isSlowConnection) {
    optimalWidth = Math.min(optimalWidth, 200); // Còn nhỏ hơn cho slow connection
    optimalQuality = Math.min(optimalQuality, 35); // Giảm quality xuống 35%
  }
  
  // Adjust for pixel ratio but cap it
  const adjustedWidth = Math.min(optimalWidth * Math.min(pixelRatio, 2), optimalWidth * 2);
  
  return {
    src: originalSrc,
    srcSet: originalSrc,
    width: adjustedWidth,
    quality: optimalQuality
  };
};

const OptimizedImage: React.ForwardRefRenderFunction<HTMLImageElement, OptimizedImageProps> = (
  { src, alt, width, height, style, priority = false, quality = 75, sizes, onClick },
  ref
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images load immediately
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate blur placeholder
  const { blurDataURL } = useBlurPlaceholder(src);

  // Intersection Observer để lazy load
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Preload khi cách viewport 100px
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate responsive image URLs với optimization cho mobile
  const imageUrls = useMemo(() => {
    if (!isInView) return { src: '', srcSet: '', width: 0, quality: 0 };
    
    return generateImageSizes(src, width, quality);
  }, [src, width, quality, isInView]);

  // Preload critical images
  useEffect(() => {
    if (priority && isInView) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrls.src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, isInView, imageUrls.src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <ImageContainer style={style} onClick={onClick} ref={imgRef}>
      {(!isLoaded || hasError) && (
        <PlaceholderDiv style={style} blurDataURL={blurDataURL}>
          {hasError && (
            <div style={{ 
              color: '#666', 
              fontSize: '12px', 
              textAlign: 'center',
              padding: '10px',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '4px'
            }}>
              ⚠️ Lỗi tải ảnh
            </div>
          )}
        </PlaceholderDiv>
      )}
      
      {isInView && !hasError && (
        <StyledImage
          ref={ref as React.MutableRefObject<HTMLImageElement>}
          src={imageUrls.src}
          srcSet={imageUrls.srcSet}
          sizes={sizes || `(max-width: 768px) 100vw, 50vw`}
          alt={alt}
          width={imageUrls.width || width} // Sử dụng optimized width
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          isLoaded={isLoaded}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...style,
            maxWidth: '100%',
            height: 'auto'
          }}
        />
      )}
    </ImageContainer>
  );
};

export default React.forwardRef(OptimizedImage);