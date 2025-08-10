import React, { useEffect, useState, useRef } from 'react';

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;         // Global min
  maxValue: number;         // Global max
  windowSize: number;       // e.g., 20000
  sliderSteps: number;
  rulerSteps: number;
  value: number;            // Current full-range value
  onChange: (event: { value: number }) => void;
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
}) => {
  const prevValueRef = useRef(value);
  const changeSequenceRef = useRef<number[]>([]);
  const lastChangeTimeRef = useRef(Date.now());

  // Get which window the value should be in
  const getWindowForValue = (val: number) => {
    const clampedVal = Math.max(minValue, Math.min(maxValue, val));
    return Math.floor((clampedVal - minValue) / windowSize);
  };

  const [currentWindow, setCurrentWindow] = useState(getWindowForValue(value));

  // Check if we need to switch windows based on external value changes
  useEffect(() => {
    const targetWindow = getWindowForValue(value);
    
    if (targetWindow !== currentWindow) {
      setCurrentWindow(targetWindow);
    }
    
    prevValueRef.current = value;
  }, [value, currentWindow, minValue, windowSize]);

  // Compute the window's min and max values
  const windowStart = minValue + currentWindow * windowSize;
  const windowEnd = Math.min(windowStart + windowSize, maxValue);

  // Determine if this is a progressive drag movement
  const isProgressiveDrag = (newValue: number) => {
    const now = Date.now();
    const timeDiff = now - lastChangeTimeRef.current;
    const prevValue = prevValueRef.current;
    
    // Add to sequence if changes are happening quickly (< 150ms apart)
    if (timeDiff < 150) {
      changeSequenceRef.current.push(newValue);
      // Keep only last 4 changes for better detection
      if (changeSequenceRef.current.length > 4) {
        changeSequenceRef.current.shift();
      }
    } else {
      // Reset sequence for slow/single changes (likely clicks)
      changeSequenceRef.current = [newValue];
    }
    
    lastChangeTimeRef.current = now;
    
    // Check for drag patterns
    const sequence = changeSequenceRef.current;
    
    // For backward: if we have repeated attempts at boundary or decreasing trend
    if (sequence.length >= 2) {
      const currentWindowStart = minValue + currentWindow * windowSize;
      
      // Backward detection: hitting boundary repeatedly or clear decreasing pattern
      const hitBoundaryCount = sequence.filter(val => val <= currentWindowStart).length;
      const hasDecreasingTrend = sequence.slice(-3).every((val, i, arr) => 
        i === 0 || val <= arr[i - 1]
      );
      const overallDecrease = newValue < prevValue;
      
      if (hitBoundaryCount >= 2 || (hasDecreasingTrend && overallDecrease)) {
        return { isDrag: true, direction: 'backward' };
      }
      
      // Forward detection: clear increasing pattern
      const hasIncreasingTrend = sequence.slice(-3).every((val, i, arr) => 
        i === 0 || val >= arr[i - 1]
      );
      const overallIncrease = newValue > prevValue;
      
      if (hasIncreasingTrend && overallIncrease && sequence.length >= 3) {
        return { isDrag: true, direction: 'forward' };
      }
    }
    
    return { isDrag: false, direction: 'none' };
  };

  // Handle slider change
  const handleSliderChange = (event: { value: number }) => {
    const newValue = event.value;
    const currentWindowStart = minValue + currentWindow * windowSize;
    const currentWindowEnd = Math.min(currentWindowStart + windowSize, maxValue);
    
    const dragInfo = isProgressiveDrag(newValue);
    
    // Only switch windows if it's a progressive drag in the right direction
    if (dragInfo.isDrag) {
      // Sliding backward to boundary
      if (newValue <= currentWindowStart && currentWindow > 0 && dragInfo.direction === 'backward') {
        const newWindow = currentWindow - 1;
        const newWindowEnd = Math.min(minValue + newWindow * windowSize + windowSize, maxValue);
        setCurrentWindow(newWindow);
        onChange({ value: newWindowEnd });
        // Reset sequence after window change
        changeSequenceRef.current = [];
        return;
      }
      
      // Sliding forward to boundary  
      if (newValue >= currentWindowEnd && currentWindowEnd < maxValue && dragInfo.direction === 'forward') {
        const newWindow = currentWindow + 1;
        const newWindowStart = minValue + newWindow * windowSize;
        setCurrentWindow(newWindow);
        onChange({ value: newWindowStart });
        // Reset sequence after window change
        changeSequenceRef.current = [];
        return;
      }
    }
    
    // Normal sliding within current window or single click
    onChange(event);
  };

  return (
    <Slider
      id={`${id}-window`}
      minValue={windowStart}
      maxValue={windowEnd}
      sliderSteps={sliderSteps}
      rulerSteps={rulerSteps}
      value={value}
      onChange={handleSliderChange}
    />
  );
};

export default WindowedSliderWrapper;
