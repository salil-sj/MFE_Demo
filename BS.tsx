import React, { useState, useEffect } from 'react';

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;         // Global min
  maxValue: number;         // Global max
  windowSize: number;       // e.g., 20000
  stepSize?: number;        // e.g., 10000 for overlapping windows
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
  stepSize = windowSize, // default to full jump if not given
  sliderSteps,
  rulerSteps,
  value,
  onChange,
}) => {
  const [windowStart, setWindowStart] = useState(minValue);
  
  // Adjust window when slider hits boundaries
  useEffect(() => {
    if (value >= windowStart + windowSize && windowStart + windowSize < maxValue) {
      // Moved past upper bound → shift forward by stepSize
      setWindowStart(prev => Math.min(prev + stepSize, maxValue - windowSize));
    } 
    else if (value <= windowStart && windowStart > minValue) {
      // Moved past lower bound → shift backward by stepSize
      setWindowStart(prev => Math.max(prev - stepSize, minValue));
    }
  }, [value, windowSize, stepSize, minValue, maxValue, windowStart]);

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
