import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

interface LazyImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const LazyImage: React.ForwardRefRenderFunction<HTMLImageElement, LazyImageProps> = (
  { src, alt, style, placeholder, onClick },
  ref
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <ImageContainer style={style} onClick={onClick}>
      {!isLoaded && (
        <PlaceholderDiv style={style}>
          <PlaceholderShimmer />
        </PlaceholderDiv>
      )}
      <Image
        ref={(node) => {
          if (imgRef.current !== node) {
            (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        src={isInView ? src : placeholder}
        alt={alt}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onLoad={handleLoad}
        loading="lazy"
      />
    </ImageContainer>
  );
};

export default React.forwardRef(LazyImage);

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
`;

const PlaceholderDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderShimmer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
