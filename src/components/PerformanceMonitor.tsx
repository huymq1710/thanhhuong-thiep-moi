import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  imageLoadCount: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${entry.startTime}ms`);
        }
        if (entry.entryType === 'resource' && (entry as PerformanceResourceTiming).initiatorType === 'img') {
          console.log(`Image loaded: ${entry.name} in ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'resource'] });

    // Get navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.startTime,
        firstContentfulPaint: fcpEntry?.startTime || 0,
        largestContentfulPaint: 0, // Will be updated by observer
        imageLoadCount: performance.getEntriesByType('resource')
          .filter(entry => (entry as PerformanceResourceTiming).initiatorType === 'img').length
      });
    });

    return () => observer.disconnect();
  }, []);

  return metrics;
};

// Component để hiển thị performance metrics trong development
export const PerformanceDebugger = () => {
  const metrics = usePerformanceMonitor();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>🚀 Performance Metrics</div>
      {metrics && (
        <>
          <div>Load Time: {metrics.loadTime.toFixed(0)}ms</div>
          <div>FCP: {metrics.firstContentfulPaint.toFixed(0)}ms</div>
          <div>Images: {metrics.imageLoadCount}</div>
        </>
      )}
    </div>
  );
};
