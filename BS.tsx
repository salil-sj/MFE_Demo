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

  // Get which window the value should be in
  const getWindowForValue = (val: number) => {
    // Clamp value to valid range first
    const clampedVal = Math.max(minValue, Math.min(maxValue, val));
    return Math.floor((clampedVal - minValue) / windowSize);
  };

  const [currentWindow, setCurrentWindow] = useState(getWindowForValue(value));

  // Check if we need to switch windows
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

  // Handle slider change - detect boundary crossing
  const handleSliderChange = (event: { value: number }) => {
    const newValue = event.value;
    const currentWindowStart = minValue + currentWindow * windowSize;
    const currentWindowEnd = Math.min(currentWindowStart + windowSize, maxValue);
    
    // Check if we're trying to go beyond current window boundaries
    if (newValue <= currentWindowStart && currentWindow > 0) {
      // Sliding backward - switch to previous window
      const newWindow = currentWindow - 1;
      const newWindowEnd = Math.min(minValue + newWindow * windowSize + windowSize, maxValue);
      setCurrentWindow(newWindow);
      // Set value to the end of the previous window
      onChange({ value: newWindowEnd });
    } else if (newValue >= currentWindowEnd && currentWindowEnd < maxValue) {
      // Sliding forward - switch to next window  
      const newWindow = currentWindow + 1;
      const newWindowStart = minValue + newWindow * windowSize;
      setCurrentWindow(newWindow);
      // Set value to the start of the next window
      onChange({ value: newWindowStart });
    } else {
      // Normal sliding within current window
      onChange(event);
    }
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
};/////

export default WindowedSliderWrapper;
