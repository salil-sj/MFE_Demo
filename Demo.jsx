import React, { useEffect, useState, useCallback } from 'react';
import Slider from './Slider'; // Your internal, unchangeable Slider component

interface DynamicSliderWrapperProps {
  id?: string;
  minValue: number;        // Full range min
  maxValue: number;        // Full range max
  sliderSteps: number;
  rulerSteps: number;
  value: number;           // Current slider value
  onChange: (value: number) => void;

  // Optional props to control dynamic behavior
  windowSize?: number;     // Visible slider window size (default: 20000)
  buffer?: number;         // Buffer near edges to trigger shift (default: 5000)
}

const DynamicSliderWrapper: React.FC<DynamicSliderWrapperProps> = ({
  id,
  minValue,
  maxValue,
  sliderSteps,
  rulerSteps,
  value,
  onChange,
  windowSize = 20000,
  buffer = 5000,
}) => {
  const [windowMin, setWindowMin] = useState(minValue);
  const [windowMax, setWindowMax] = useState(minValue + windowSize);

  // Dynamically shift the visible slider window when needed
  useEffect(() => {
    if (value >= windowMax - buffer && windowMax < maxValue) {
      const newWindowMin = Math.min(value - buffer, maxValue - windowSize);
      const newWindowMax = newWindowMin + windowSize;
      setWindowMin(newWindowMin);
      setWindowMax(newWindowMax);
    } else if (value <= windowMin + buffer && windowMin > minValue) {
      const newWindowMin = Math.max(value - windowSize + buffer, minValue);
      const newWindowMax = newWindowMin + windowSize;
      setWindowMin(newWindowMin);
      setWindowMax(newWindowMax);
    }
  }, [value, windowMin, windowMax, minValue, maxValue, windowSize, buffer]);

  // Handle slider value change from internal component
  const handleSliderChange = useCallback(
    (event: any) => {
      const newValue = event?.value;
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <Slider
      id={id}
      minValue={windowMin}
      maxValue={windowMax}
      sliderSteps={sliderSteps}
      rulerSteps={rulerSteps}
      value={value}
      onChange={handleSliderChange}
    />
  );
};

export default DynamicSliderWrapper;

import React, { useState } from 'react';
import DynamicSliderWrapper from './DynamicSliderWrapper';

const App: React.FC = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <h2>Dynamic Range Slider</h2>
      <DynamicSliderWrapper
        id="salary-slider"
        minValue={0}
        maxValue={100000}
        sliderSteps={100}
        rulerSteps={5000}
        value={value}
        onChange={setValue}
      />
      <p>Selected Value: {value}</p>
    </div>
  );
};

export default App;
