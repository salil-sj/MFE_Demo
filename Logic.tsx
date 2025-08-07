import React, { useState, useEffect, useRef, useCallback } from 'react';

// Props for the wrapper
interface WindowedSliderWrapperProps {
  id: string;
  value: number;
  onChange: (val: number) => void;
  minValue: number;
  maxValue: number;
  windowSize: number;
  sliderSteps: number;
  rulerSteps: number;
  shiftThreshold?: number; // e.g., 0.05 for 5%
  debounceMs?: number;     // e.g., 200ms
}

// Internal <Slider /> component signature (assumed)
declare const Slider: React.FC<{
  id: string;
  minValue: number;
  maxValue: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (event: { value: number }) => void;
}>;

const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
  id,
  value,
  onChange,
  minValue,
  maxValue,
  windowSize,
  sliderSteps,
  rulerSteps,
  shiftThreshold = 0.05,
  debounceMs = 200
}) => {
  const maxWindow = Math.floor((maxValue - minValue) / windowSize);
  const [currentWindow, setCurrentWindow] = useState(Math.floor((value - minValue) / windowSize));
  const [localValue, setLocalValue] = useState(value);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  // Recalculate windowStart
  const windowStart = minValue + currentWindow * windowSize;
  const windowEnd = windowStart + windowSize;

  // Update localValue if external value changes
  useEffect(() => {
    if (value < windowStart || value > windowEnd) {
      const newWindow = Math.floor((value - minValue) / windowSize);
      setCurrentWindow(newWindow);
    }
    setLocalValue(value);
  }, [value, windowStart, windowEnd, minValue, windowSize]);

  const scheduleWindowShift = useCallback((newWindow: number) => {
    if (timeoutRef.current) return;

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setCurrentWindow(newWindow);
      const newStart = minValue + newWindow * windowSize;
      const newVal = newStart + (localValue % windowSize);
      setLocalValue(newVal);
      onChange(newVal);
    }, debounceMs);
  }, [localValue, debounceMs, minValue, onChange, windowSize]);

  const handleChange = (event: { value: number }) => {
    const newValue = event.value;
    setLocalValue(newValue);
    onChange(newValue);

    const lowerShiftPoint = windowStart + windowSize * shiftThreshold;
    const upperShiftPoint = windowStart + windowSize * (1 - shiftThreshold);

    if (!isDraggingRef.current) {
      if (newValue <= lowerShiftPoint && currentWindow > 0) {
        scheduleWindowShift(currentWindow - 1);
      } else if (newValue >= upperShiftPoint && currentWindow < maxWindow) {
        scheduleWindowShift(currentWindow + 1);
      }
    }
  };

  return (
    <div
      onMouseDown={() => { isDraggingRef.current = true; }}
      onMouseUp={() => { isDraggingRef.current = false; }}
      onMouseLeave={() => { isDraggingRef.current = false; }}
    >
      <Slider
        id={id}
        minValue={windowStart}
        maxValue={windowStart + windowSize}
        value={localValue}
        sliderSteps={sliderSteps}
        rulerSteps={rulerSteps}
        onChange={handleChange}
      />
    </div>
  );
};

export default WindowedSliderWrapper;
