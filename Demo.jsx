// DynamicSliderWrapper.tsx
import React, { useEffect, useState } from 'react';
import ExternalSlider from './ExternalSlider'; // <-- your existing slider

interface DynamicSliderWrapperProps {
  min: number;
  max: number;
  sliderStep: number;
  rulerStep: number;
  value: number;
  setValue: (val: number) => void;
  windowSize?: number;
  buffer?: number;
}

const DynamicSliderWrapper: React.FC<DynamicSliderWrapperProps> = ({
  min,
  max,
  sliderStep,
  rulerStep,
  value,
  setValue,
  windowSize = 20000,
  buffer = 5000,
}) => {
  const [windowMin, setWindowMin] = useState(min);
  const [windowMax, setWindowMax] = useState(min + windowSize);

  // Shift window when value is close to window bounds
  useEffect(() => {
    if (value >= windowMax - buffer && windowMax < max) {
      const newMin = Math.min(value - buffer, max - windowSize);
      const newMax = newMin + windowSize;
      setWindowMin(newMin);
      setWindowMax(newMax);
    } else if (value <= windowMin + buffer && windowMin > min) {
      const newMin = Math.max(value - windowSize + buffer, min);
      const newMax = newMin + windowSize;
      setWindowMin(newMin);
      setWindowMax(newMax);
    }
  }, [value, windowMin, windowMax, min, max, buffer, windowSize]);

  return (
    <ExternalSlider
      minValue={windowMin}
      maxValue={windowMax}
      value={value}
      setValue={setValue}
      sliderStep={sliderStep}
      rulerStep={rulerStep}
    />
  );
};

export default DynamicSliderWrapper;
