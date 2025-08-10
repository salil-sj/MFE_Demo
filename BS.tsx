import React, { useEffect, useState } from "react";

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  stepSize?: number;        // how much the window moves each shift (default = windowSize/2)
  sliderSteps: number;
  rulerSteps: number;
  value: number;            // global value
  onChange: (event: { value: number }) => void;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function computeWindowStart(
  value: number,
  minValue: number,
  maxValue: number,
  windowSize: number,
  stepSize: number
) {
  const totalRange = maxValue - minValue;
  if (windowSize >= totalRange) return minValue; // whole range fits in one window

  const half = windowSize / 2;
  // center-based deterministic formula:
  const rel = value - minValue - half;
  const n = Math.floor(rel / stepSize); // can be negative, floor works
  let ws = minValue + n * stepSize;
  // clamp so window doesn't go beyond bounds
  ws = clamp(ws, minValue, maxValue - windowSize);
  return ws;
}

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
  const [windowStart, setWindowStart] = useState<number>(() =>
    computeWindowStart(value, minValue, maxValue, windowSize, effectiveStep)
  );

  // Recompute deterministically whenever the global value (or config) changes.
  useEffect(() => {
    const ws = computeWindowStart(value, minValue, maxValue, windowSize, effectiveStep);
    if (ws !== windowStart) {
      setWindowStart(ws);
    }
  }, [value, minValue, maxValue, windowSize, effectiveStep, windowStart]);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  // Ensure the value passed into the internal slider is within the current window.
  const sliderValue = clamp(value, windowStart, windowEnd);

  // Forward the slider onChange as-is (the slider will emit absolute/global values
  // because we set its minValue/maxValue to windowStart/windowEnd).
  const handleChange = (event: { value: number }) => {
    onChange(event);
  };

  return (
    <Slider
      id={`${id}-window`}
      minValue={windowStart}
      maxValue={windowEnd}
      sliderSteps={sliderSteps}
      rulerSteps={rulerSteps}
      value={sliderValue}
      onChange={handleChange}
    />
  );
};

export default WindowedSliderWrapper;
