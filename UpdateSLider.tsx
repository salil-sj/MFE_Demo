import React, { useEffect, useState } from 'react';

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
  // Get which window the value belongs to
  const getWindowForValue = (val: number) =>
    Math.floor((val - minValue) / windowSize);

  const [currentWindow, setCurrentWindow] = useState(getWindowForValue(value));

  // If value moves outside the current window, update the window
  useEffect(() => {
    const newWindow = getWindowForValue(value);
    if (newWindow !== currentWindow) {
      setCurrentWindow(newWindow);
    }
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
