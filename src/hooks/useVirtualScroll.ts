import { useState, useEffect, useRef, useMemo } from 'react';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  itemsPerRow?: number;
  overscan?: number; // Số items thêm để render (buffer)
}

interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  virtualItems: Array<{
    index: number;
    offsetTop: number;
  }>;
  totalHeight: number;
  scrollElementRef: React.RefObject<HTMLDivElement>;
}

export const useVirtualScroll = (
  totalItems: number,
  options: UseVirtualScrollOptions
): VirtualScrollResult => {
  const {
    itemHeight,
    containerHeight,
    itemsPerRow = 3,
    overscan = 5
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate row height (including gap)
  const rowHeight = itemHeight + 8; // 8px gap
  const totalRows = Math.ceil(totalItems / itemsPerRow);

  // Calculate visible range
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const startIndex = startRow * itemsPerRow;
  const endIndex = Math.min(totalItems - 1, (endRow + 1) * itemsPerRow - 1);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const row = Math.floor(i / itemsPerRow);
      items.push({
        index: i,
        offsetTop: row * rowHeight
      });
    }
    return items;
  }, [startIndex, endIndex, itemsPerRow, rowHeight]);

  const totalHeight = totalRows * rowHeight;

  // Handle scroll
  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    startIndex,
    endIndex,
    virtualItems,
    totalHeight,
    scrollElementRef
  };
};

// Hook để tính toán container size tự động
export const useContainerSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    // Update size on mount and resize
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { ...size, containerRef };
};

// Hook để detect viewport size
export const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportSize;
};