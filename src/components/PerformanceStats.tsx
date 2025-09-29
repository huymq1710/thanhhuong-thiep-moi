import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MobileOptimizer, ImageLoadMonitor } from '@/utils/mobileOptimization';

interface PerformanceStatsProps {
  visible?: boolean;
}

const StatsContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  z-index: 1000;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  max-width: 250px;
`;

const StatItem = styled.div`
  margin-bottom: 5px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 18px;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #005a9e;
  }
`;

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ visible: propVisible }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    avgLoadTime: 0,
    failureRate: 0,
    deviceMemory: 'Unknown',
    isMobile: false,
    isSlowConnection: false,
    quality: 75,
    maxWidth: 800
  });

  useEffect(() => {
    const updateStats = () => {
      const settings = MobileOptimizer.getMemoryOptimizedSettings();
      const memoryInfo = MobileOptimizer.getMemoryInfo();
      
      setStats({
        avgLoadTime: Math.round(ImageLoadMonitor.getAverageLoadTime()),
        failureRate: Math.round(ImageLoadMonitor.getFailureRate() * 100),
        deviceMemory: memoryInfo ? `${memoryInfo.deviceMemory}GB` : 'Unknown',
        isMobile: settings.isMobile,
        isSlowConnection: settings.isSlowConnection,
        quality: settings.quality,
        maxWidth: settings.maxWidth
      });
    };

    // Update stats immediately
    updateStats();

    // Update stats every 5 seconds when visible
    const interval = setInterval(() => {
      if (isVisible || propVisible) {
        updateStats();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, propVisible]);

  const visible = propVisible !== undefined ? propVisible : isVisible;

  return (
    <>
      <StatsContainer visible={visible}>
        <StatItem><strong>📱 Performance Stats</strong></StatItem>
        <StatItem>Device: {stats.isMobile ? 'Mobile' : 'Desktop'}</StatItem>
        <StatItem>Connection: {stats.isSlowConnection ? 'Slow' : 'Fast'}</StatItem>
        <StatItem>Memory: {stats.deviceMemory}</StatItem>
        <StatItem>Avg Load Time: {stats.avgLoadTime}ms</StatItem>
        <StatItem>Failure Rate: {stats.failureRate}%</StatItem>
        <StatItem>Image Quality: {stats.quality}%</StatItem>
        <StatItem>Max Width: {stats.maxWidth}px</StatItem>
        <StatItem>
          Status: {stats.avgLoadTime > 3000 || stats.failureRate > 10 ? '⚠️ Poor' : '✅ Good'}
        </StatItem>
      </StatsContainer>
      
      {propVisible === undefined && (
        <ToggleButton
          onClick={() => setIsVisible(!isVisible)}
          title="Toggle Performance Stats"
        >
          📊
        </ToggleButton>
      )}
    </>
  );
};

export default PerformanceStats;