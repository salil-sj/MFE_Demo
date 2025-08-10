import React, { useState, useEffect, useRef } from "react";

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  stepSize?: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (event: { value: number }) => void;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
  id,
  minValue,
  maxValue,
  windowSize,
  stepSize,
  sliderSteps,
  rulerSteps,
  value,
  onChange,
}) => {
  const effectiveStep = stepSize ?? Math.floor(windowSize / 2);

  const [windowStart, setWindowStart] = useState(minValue);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    const direction = value > prevValue ? "forward" : value < prevValue ? "backward" : null;

    // Forward shift: when going beyond window end
    if (direction === "forward" && value >= windowStart + windowSize && windowStart + windowSize < maxValue) {
      setWindowStart(prev => Math.min(prev + effectiveStep, maxValue - windowSize));
    }
    // Backward shift: when going below window start
    else if (direction === "backward" && value <= windowStart && windowStart > minValue) {
      setWindowStart(prev => Math.max(prev - effectiveStep, minValue));
    }

    prevValueRef.current = value;
  }, [value, windowSize, effectiveStep, minValue, maxValue, windowStart]);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  const sliderValue = clamp(value, windowStart, windowEnd);

  return (
    <Slider
      id={`${id}-window`}
      minValue={windowStart}
      maxValue={windowEnd}
      sliderSteps={sliderSteps}
      rulerSteps={rulerSteps}
      value={sliderValue}
      onChange={onChange}
    />
  );
};

export default WindowedSliderWrapper;
