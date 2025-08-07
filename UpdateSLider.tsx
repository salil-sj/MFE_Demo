import React, { useMemo } from 'react';

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
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
  const currentWindow = useMemo(() => {
    return Math.floor((value - minValue) / windowSize);
  }, [value, minValue, windowSize]);

  const windowStart = minValue + currentWindow * windowSize;
  const windowEnd = Math.min(windowStart + windowSize, maxValue);

  return (
    <Slider
      id={`${id}-window-${currentWindow}`}
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
