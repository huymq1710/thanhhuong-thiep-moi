import React, { useMemo, useEffect, useCallback } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/style.css';
import images, { getOptimizedImageUrl } from '@/layout/Gallery/Images.ts';
import OptimizedImage from '@/components/OptimizedImage.tsx';
import { useVirtualScroll, useViewportSize } from '@/hooks/useVirtualScroll';
import { MobileOptimizer, ImageLoadMonitor } from '@/utils/mobileOptimization';
import styled from '@emotion/styled';

// Styled components
const GalleryContainer = styled.div`
  height: 70vh; /* Fixed height for virtual scrolling */
  overflow-y: auto;
  position: relative;
  padding: 0 4px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a1a1a1;
    }
  }
`;

const VirtualContent = styled.div<{ totalHeight: number }>`
  height: ${props => props.totalHeight}px;
  position: relative;
`;

const VirtualItem = styled.div<{ offsetTop: number; visible: boolean; isMobile: boolean }>`
  position: absolute;
  top: ${props => props.offsetTop}px;
  width: calc(50% - 4px);
  height: ${props => props.isMobile ? '160px' : '200px'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  
  &:nth-of-type(2n+1) {
    left: 0;
  }
  
  &:nth-of-type(2n) {
    left: calc(50% + 4px);
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #666;
  font-size: 9.8px;
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-top-color: #666;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const VirtualizedPhotoGallery: React.FC = () => {
  const viewportSize = useViewportSize();
  
  // Get mobile optimization settings
  const mobileSettings = useMemo(() => {
    return MobileOptimizer.getMemoryOptimizedSettings();
  }, []);
  
  // Cấu hình virtual scroll - tối ưu cho mobile
  const virtualScrollConfig = useMemo(() => ({
    itemHeight: mobileSettings.isMobile ? 160 : 200, // Tăng height cho layout 2x2
    containerHeight: Math.min(viewportSize.height * 0.7, mobileSettings.isMobile ? 400 : 600), // Giảm container height cho mobile
    itemsPerRow: 2,
    overscan: mobileSettings.isMobile ? 1 : 2 // Ít buffer hơn cho mobile để tiết kiệm memory
  }), [viewportSize.height, mobileSettings.isMobile]);

  // Cleanup invisible images để tiết kiệm memory
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Browser tab is hidden, clean up some resources
        ImageLoadMonitor.reset();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Monitor performance và adjust settings
  const getAdaptiveQuality = useCallback(() => {
    if (ImageLoadMonitor.shouldReduceQuality()) {
      return Math.max(mobileSettings.quality - 15, 20); // Reduce but not below 20
    }
    return mobileSettings.quality;
  }, [mobileSettings.quality]);

  const {
    virtualItems,
    totalHeight,
    scrollElementRef,
    startIndex,
    endIndex
  } = useVirtualScroll(images.length, virtualScrollConfig);



  const memoizedImages = useMemo(() => images, []);

  return (
    <Gallery>
      <GalleryContainer ref={scrollElementRef}>
        <VirtualContent totalHeight={totalHeight}>
          {virtualItems.map((virtualRow) => {
            const imageIndex = virtualRow.index;
            const image = memoizedImages[imageIndex];
            
            if (!image) return null;

            // Tính toán column position
            const columnIndex = imageIndex % 3;
            
            return (
              <VirtualItem
                key={imageIndex}
                offsetTop={virtualRow.offsetTop}
                visible={imageIndex >= startIndex && imageIndex <= endIndex}
                isMobile={mobileSettings.isMobile}
                style={{
                  left: `${columnIndex * 33.333 + columnIndex * 0.8}%`
                }}
              >
                <Item
                  cropped
                  original={image.source}
                  thumbnail={getOptimizedImageUrl(
                    image.source, 
                    mobileSettings.isMobile ? 100 : 150, 
                    getAdaptiveQuality()
                  )}
                  width={image.width}
                  height={image.height}
                >
                  {({ ref, open }) => (
                    <OptimizedImage
                      style={{
                        cursor: 'pointer',
                        objectFit: 'cover',
                        width: '100%',
                        height: mobileSettings.isMobile ? '120px' : '150px',
                        borderRadius: '8px',
                        transition: 'transform 0.2s ease-in-out',
                      }}
                      alt={image.alt}
                      src={image.source}
                      width={mobileSettings.isMobile ? 80 : 100}
                      height={mobileSettings.isMobile ? 120 : 150}
                      priority={imageIndex < (mobileSettings.isMobile ? 3 : 6)} // Ít ảnh ưu tiên hơn cho mobile
                      quality={getAdaptiveQuality()} // Sử dụng adaptive quality
                      sizes={mobileSettings.isMobile ? 
                        "(max-width: 768px) 33vw, 100px" : 
                        "(max-width: 768px) 33vw, 120px"
                      }
                      ref={ref as React.MutableRefObject<HTMLImageElement>}
                      onClick={open}
                    />
                  )}
                </Item>
              </VirtualItem>
            );
          })}
          
          {/* Loading indicator cho những ảnh đang load */}
          {startIndex > 0 && (
            <LoadingIndicator style={{ top: '10px' }}>
              Đang tải thêm ảnh...
            </LoadingIndicator>
          )}
          
          {/* Performance stats for debugging - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
              {/* Add PerformanceStats component if needed */}
            </div>
          )}
        </VirtualContent>
      </GalleryContainer>
    </Gallery>
  );
};

export default VirtualizedPhotoGallery;
