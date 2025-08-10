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
    
    // Add to sequence if changes are happening quickly (< 100ms apart)
    if (timeDiff < 100) {
      changeSequenceRef.current.push(newValue);
      // Keep only last 5 changes
      if (changeSequenceRef.current.length > 5) {
        changeSequenceRef.current.shift();
      }
    } else {
      // Reset sequence for slow/single changes (likely clicks)
      changeSequenceRef.current = [newValue];
    }
    
    lastChangeTimeRef.current = now;
    
    // If we have multiple rapid changes in the same direction, it's likely a drag
    if (changeSequenceRef.current.length >= 3) {
      const sequence = changeSequenceRef.current;
      const isDecreasing = sequence.every((val, i) => 
        i === 0 || val <= sequence[i - 1]
      );
      const isIncreasing = sequence.every((val, i) => 
        i === 0 || val >= sequence[i - 1]
      );
      
      return { isDrag: true, direction: isDecreasing ? 'backward' : isIncreasing ? 'forward' : 'none' };
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
