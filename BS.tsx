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
  const isDraggingRef = useRef(false);
  const dragStartValueRef = useRef(value);
  const lastChangeValueRef = useRef(value);

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

  // Handle slider change
  const handleSliderChange = (event: { value: number }) => {
    const newValue = event.value;
    const currentWindowStart = minValue + currentWindow * windowSize;
    const currentWindowEnd = Math.min(currentWindowStart + windowSize, maxValue);
    
    // If we're dragging and hit a boundary, check drag direction
    if (isDraggingRef.current) {
      const dragDirection = newValue - dragStartValueRef.current;
      const recentDirection = newValue - lastChangeValueRef.current;
      
      // Sliding backward to boundary
      if (newValue <= currentWindowStart && currentWindow > 0 && 
          (dragDirection < 0 || recentDirection < 0)) {
        const newWindow = currentWindow - 1;
        const newWindowEnd = Math.min(minValue + newWindow * windowSize + windowSize, maxValue);
        setCurrentWindow(newWindow);
        onChange({ value: newWindowEnd });
        return;
      }
      
      // Sliding forward to boundary  
      if (newValue >= currentWindowEnd && currentWindowEnd < maxValue && 
          (dragDirection > 0 || recentDirection >= 0)) {
        const newWindow = currentWindow + 1;
        const newWindowStart = minValue + newWindow * windowSize;
        setCurrentWindow(newWindow);
        onChange({ value: newWindowStart });
        return;
      }
    }
    
    // Normal sliding within current window or click event
    lastChangeValueRef.current = newValue;
    onChange(event);
  };

  // Handle mouse events to track dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartValueRef.current = value;
    lastChangeValueRef.current = value;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDraggingRef.current = false;
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartValueRef.current = value;
    lastChangeValueRef.current = value;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    isDraggingRef.current = false;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Slider
        id={`${id}-window`}
        minValue={windowStart}
        maxValue={windowEnd}
        sliderSteps={sliderSteps}
        rulerSteps={rulerSteps}
        value={value}
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default WindowedSliderWrapper;
