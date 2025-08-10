import React, { useState, useEffect, useRef } from "react";

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  stepSize?: number;        // default = windowSize / 2
  sliderSteps: number;
  rulerSteps: number;
  value: number;            // global absolute value
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
  const effectiveStep = Math.max(1, Math.floor(stepSize ?? Math.floor(windowSize / 2)));
  const [windowStart, setWindowStart] = useState<number>(minValue);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    const prev = prevValueRef.current;
    // update prev even when equal to keep ref fresh
    if (value === prev) return;

    // Moving forward or backward?
    const movingForward = value > prev;
    let ws = windowStart;

    if (movingForward) {
      // Move forward while value is at/over the current window end
      while (value >= ws + windowSize && ws + effectiveStep <= maxValue - windowSize) {
        ws = Math.min(ws + effectiveStep, maxValue - windowSize);
      }
    } else {
      // Move backward while value is at/below the current window start
      while (value <= ws && ws - effectiveStep >= minValue) {
        ws = Math.max(ws - effectiveStep, minValue);
      }
    }

    if (ws !== windowStart) {
      setWindowStart(ws);
    }

    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

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
