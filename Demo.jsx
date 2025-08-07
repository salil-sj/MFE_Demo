import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

// Assuming your Slider component is imported like this
// import { Slider } from 'your-internal-library';

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0;
`;

const WindowInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const CurrentValue = styled.div`
  font-weight: bold;
  color: #333;
`;

const WindowRange = styled.div`
  font-size: 12px;
  color: #888;
`;

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (event: { value: number }) => void;
  // Optional: delay before window shift (in ms)
  windowShiftDelay?: number;
  // Optional: threshold from edge to trigger window shift (0-1, where 1 = edge)
  shiftThreshold?: number;
}

const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
  id,
  minValue,
  maxValue,
  windowSize,
  sliderSteps,
  rulerSteps,
  value,
  onChange,
  windowShiftDelay = 500, // 500ms delay before shifting
  shiftThreshold = 0.95, // Shift when reaching 95% of window edge
}) => {
  // Calculate which window the current value should be in
  const getWindowForValue = useCallback((val: number): number => {
    return Math.floor((val - minValue) / windowSize);
  }, [minValue, windowSize]);

  // State management
  const [currentWindow, setCurrentWindow] = useState(() => getWindowForValue(value));
  const [isDragging, setIsDragging] = useState(false);
  const [pendingShift, setPendingShift] = useState<NodeJS.Timeout | null>(null);
  
  // Refs for tracking state
  const isDraggingRef = useRef(false);
  const lastChangeRef = useRef(Date.now());
  const mountedRef = useRef(true);

  // Calculate current window bounds
  const windowStart = minValue + (currentWindow * windowSize);
  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  
  // Convert global value to local slider value (0 to windowSize)
  const localValue = value - windowStart;
  
  // Calculate thresholds for window shifting
  const lowerShiftPoint = windowSize * (1 - shiftThreshold);
  const upperShiftPoint = windowSize * shiftThreshold;

  // Clear any pending shifts
  const clearPendingShift = useCallback(() => {
    if (pendingShift) {
      clearTimeout(pendingShift);
      setPendingShift(null);
    }
  }, [pendingShift]);

  // Handle window shifting logic
  const scheduleWindowShift = useCallback((targetWindow: number) => {
    if (!isDraggingRef.current && targetWindow !== currentWindow) {
      clearPendingShift();
      
      const timeoutId = setTimeout(() => {
        if (!isDraggingRef.current && mountedRef.current) {
          setCurrentWindow(targetWindow);
          setPendingShift(null);
        }
      }, windowShiftDelay);
      
      setPendingShift(timeoutId);
    }
  }, [currentWindow, windowShiftDelay, clearPendingShift]);

  // Handle slider value changes
  const handleSliderChange = useCallback((event: { value: number }) => {
    const newLocalValue = event.value;
    const newGlobalValue = windowStart + newLocalValue;
    
    // Ensure value stays within global bounds
    const clampedGlobalValue = Math.max(minValue, Math.min(maxValue, newGlobalValue));
    
    // Update last change timestamp
    lastChangeRef.current = Date.now();
    
    // Call parent onChange with global value
    onChange({ value: clampedGlobalValue });
    
    // Check if we need to shift windows (only if not currently dragging)
    if (!isDraggingRef.current) {
      const targetWindowForValue = getWindowForValue(clampedGlobalValue);
      
      // Check if we're near the edges and should consider shifting
      if (newLocalValue <= (windowSize - upperShiftPoint) && targetWindowForValue < currentWindow) {
        // Near left edge, shift to previous window
        scheduleWindowShift(Math.max(0, currentWindow - 1));
      } else if (newLocalValue >= upperShiftPoint && targetWindowForValue > currentWindow) {
        // Near right edge, shift to next window
        const maxWindow = Math.floor((maxValue - minValue) / windowSize);
        scheduleWindowShift(Math.min(maxWindow, currentWindow + 1));
      }
    }
  }, [
    windowStart,
    minValue,
    maxValue,
    onChange,
    currentWindow,
    windowSize,
    upperShiftPoint,
    getWindowForValue,
    scheduleWindowShift
  ]);

  // Track mouse events for dragging state
  useEffect(() => {
    const handleMouseDown = () => {
      setIsDragging(true);
      isDraggingRef.current = true;
      clearPendingShift();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      
      // Small delay to allow final value changes to process
      setTimeout(() => {
        if (mountedRef.current) {
          const timeSinceLastChange = Date.now() - lastChangeRef.current;
          
          // Only consider window shift if some time has passed since last change
          if (timeSinceLastChange > 50) {
            const targetWindow = getWindowForValue(value);
            if (targetWindow !== currentWindow) {
              scheduleWindowShift(targetWindow);
            }
          }
        }
      }, 100);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        // Update timestamp to indicate recent activity
        lastChangeRef.current = Date.now();
      }
    };

    // Add global event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Also listen for touch events on mobile
    window.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [value, currentWindow, getWindowForValue, scheduleWindowShift, clearPendingShift]);

  // Update window when value changes externally
  useEffect(() => {
    const targetWindow = getWindowForValue(value);
    if (targetWindow !== currentWindow && !isDraggingRef.current) {
      setCurrentWindow(targetWindow);
      clearPendingShift();
    }
  }, [value, currentWindow, getWindowForValue, clearPendingShift]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearPendingShift();
    };
  }, [clearPendingShift]);

  // Calculate display values for ruler steps
  const getDisplaySteps = () => {
    const stepSize = windowSize / rulerSteps;
    return rulerSteps;
  };

  return (
    <SliderContainer>
      <WindowInfo>
        <CurrentValue>Value: {value.toLocaleString()}</CurrentValue>
        <WindowRange>
          Window: {windowStart.toLocaleString()} - {windowEnd.toLocaleString()}
          {isDragging && ' (dragging)'}
          {pendingShift && ' (shifting...)'}
        </WindowRange>
      </WindowInfo>
      
      {/* Your internal Slider component */}
      <Slider
        id={`${id}-window-${currentWindow}`}
        minValue={0}
        maxValue={Math.min(windowSize, windowEnd - windowStart)}
        sliderSteps={sliderSteps}
        rulerSteps={getDisplaySteps()}
        value={Math.max(0, Math.min(localValue, windowEnd - windowStart))}
        onChange={handleSliderChange}
      />
    </SliderContainer>
  );
};

export default WindowedSliderWrapper;
