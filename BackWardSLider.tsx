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

  // Get which window the value belongs to
  const getWindowForValue = (val: number, previousVal?: number) => {
    const rawWindow = (val - minValue) / windowSize;
    
    // If we have a previous value, determine slide direction
    if (previousVal !== undefined) {
      const isMovingBackward = val < previousVal;
      
      // At exact boundary
      if (rawWindow === Math.floor(rawWindow)) {
        if (isMovingBackward && rawWindow > 0) {
          return Math.floor(rawWindow) - 1; // Move to previous window
        }
      }
    }
    
    return Math.floor(rawWindow);
  };

  const [currentWindow, setCurrentWindow] = useState(getWindowForValue(value));

  // If value moves outside the current window, update the window
  useEffect(() => {
    const newWindow = getWindowForValue(value, prevValueRef.current);
    
    if (newWindow !== currentWindow) {
      setCurrentWindow(newWindow);
    }
    
    prevValueRef.current = value;
  }, [value, currentWindow, minValue, windowSize]);

  // Compute the window's min and max values
  const windowStart = minValue + currentWindow * windowSize;
  const windowEnd = Math.min(windowStart + windowSize, maxValue);

  return (
    <Slider
      id={`${id}-window`}
      minValue={windowStart}
      maxValue={windowEnd}
      sliderSteps={sliderSteps}
      rulerSteps={rulerSteps}
      value={value}
      onChange={onChange}
    />
  );
};

export default WindowedSliderWrapper;
