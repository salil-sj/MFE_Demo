import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// This simulates your internal Slider component (do not change it in real code)
interface SliderProps {
  id: string;
  minValue: number;
  maxValue: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (event: { value: number }) => void;
}
const Slider: React.FC<SliderProps> = ({ id, minValue, maxValue, sliderSteps, rulerSteps, value, onChange }) => {
  return (
    <input
      type="range"
      id={id}
      min={minValue}
      max={maxValue}
      step={sliderSteps}
      value={value}
      onChange={(e) => onChange({ value: Number(e.target.value) })}
    />
  );
};

// -------------------- YOUR WRAPPER COMPONENT -----------------------

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  step: number; // Original step size
  rulerSteps: number;
  value: number;
  onFinalChange: (val: number) => void;
  windowSize?: number; // default: 20000
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.div`
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 14px;
`;

export const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
  id,
  minValue,
  maxValue,
  step,
  rulerSteps,
  value,
  onFinalChange,
  windowSize = 20000,
}) => {
  const [windowStart, setWindowStart] = useState(minValue);
  const [localValue, setLocalValue] = useState(value);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);

  useEffect(() => {
    // Shift window if local value moves outside current window
    if (localValue >= windowEnd && windowEnd < maxValue) {
      setWindowStart(windowStart + windowSize);
    } else if (localValue < windowStart && windowStart > minValue) {
      setWindowStart(Math.max(minValue, windowStart - windowSize));
    }
  }, [localValue]);

  const handleChange = (event: { value: number }) => {
    const actualValue = event.value;
    setLocalValue(actualValue);

    const nextStart = windowStart + windowSize;
    const prevStart = windowStart - windowSize;

    // Move window on edge
    if (actualValue >= windowEnd && windowEnd < maxValue) {
      setWindowStart(nextStart);
    } else if (actualValue <= windowStart && windowStart > minValue) {
      setWindowStart(prevStart);
    }

    onFinalChange(actualValue);
  };

  return (
    <Wrapper>
      <Label>
        Showing range: {windowStart.toLocaleString()} - {windowEnd.toLocaleString()}
      </Label>
      <Slider
        id={id}
        minValue={windowStart}
        maxValue={windowEnd}
        sliderSteps={step}
        rulerSteps={rulerSteps}
        value={Math.min(Math.max(localValue, windowStart), windowEnd)}
        onChange={handleChange}
      />
    </Wrapper>
  );
};
