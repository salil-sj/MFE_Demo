import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

// import { Slider } from 'your-internal-library';

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0;
`;

const WindowInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const CurrentValue = styled.div`
  font-weight: bold;
  color: #333;
`;

const WindowRange = styled.div`
  font-size: 12px;
  color: #888;
`;

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (event: { value: number }) => void;
  windowShiftDelay?: number;
  shiftThreshold?: number;
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
  windowShiftDelay = 500,
  shiftThreshold = 0.95,
}) => {
  // Helpers
  const getWindowForValue = useCallback(
    (val: number): number => Math.floor((val - minValue) / windowSize),
    [minValue, windowSize]
  );

  const maxWindow = Math.floor((maxValue - minValue) / windowSize);

  // State
  const [currentWindow, setCurrentWindow] = useState(() => getWindowForValue(value));
  const [isDragging, setIsDragging] = useState(false);
  const [pendingShift, setPendingShift] = useState<NodeJS.Timeout | null>(null);

  // Refs
  const isDraggingRef = useRef(false);
  const lastChangeRef = useRef(Date.now());
  const mountedRef = useRef(true);

  // Derived
  const windowStart = minValue + currentWindow * windowSize;
  const windowEnd = Math.min(windowStart + windowSize, maxValue);

  // Clear any pending shift timeout
  const clearPendingShift = useCallback(() => {
    if (pendingShift) {
      clearTimeout(pendingShift);
      setPendingShift(null);
    }
  }, [pendingShift]);

  // Schedule window shift
  const scheduleWindowShift = useCallback(
    (targetWindow: number) => {
      if (!isDraggingRef.current && targetWindow !== currentWindow) {
        clearPendingShift();

        const timeoutId = setTimeout(() => {
          if (!isDraggingRef.current && mountedRef.current) {
            setCurrentWindow(targetWindow);
            setPendingShift(null);
          }
        }, windowShiftDelay);

        setPendingShift(timeoutId);
      }
    },
    [currentWindow, windowShiftDelay, clearPendingShift]
  );

  // Handle slider change
  const handleSliderChange = useCallback(
    (event: { value: number }) => {
      const newGlobalValue = Math.max(minValue, Math.min(maxValue, event.value));
      lastChangeRef.current = Date.now();
      onChange({ value: newGlobalValue });

      if (!isDraggingRef.current) {
        const lowerShiftPoint = windowStart + windowSize * (1 - shiftThreshold);
        const upperShiftPoint = windowStart + windowSize * shiftThreshold;

        if (newGlobalValue <= lowerShiftPoint && currentWindow > 0) {
          scheduleWindowShift(currentWindow - 1);
        } else if (newGlobalValue >= upperShiftPoint && currentWindow < maxWindow) {
          scheduleWindowShift(currentWindow + 1);
        }
      }
    },
    [
      minValue,
      maxValue,
      onChange,
      currentWindow,
      windowStart,
      windowSize,
      shiftThreshold,
      scheduleWindowShift,
      maxWindow,
    ]
  );

  // Drag tracking
  useEffect(() => {
    const handleMouseDown = () => {
      setIsDragging(true);
      isDraggingRef.current = true;
      clearPendingShift();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;

      setTimeout(() => {
        if (mountedRef.current) {
          const timeSinceLastChange = Date.now() - lastChangeRef.current;
          if (timeSinceLastChange > 50) {
            const targetWindow = getWindowForValue(value);
            if (targetWindow !== currentWindow) {
              scheduleWindowShift(targetWindow);
            }
          }
        }
      }, 100);
    };

    const handleMouseMove = () => {
      if (isDraggingRef.current) {
        lastChangeRef.current = Date.now();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [value, currentWindow, getWindowForValue, scheduleWindowShift, clearPendingShift]);

  // Update window if value is externally changed
  useEffect(() => {
    const targetWindow = getWindowForValue(value);
    if (targetWindow !== currentWindow && !isDraggingRef.current) {
      setCurrentWindow(targetWindow);
      clearPendingShift();
    }
  }, [value, currentWindow, getWindowForValue, clearPendingShift]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearPendingShift();
    };
  }, [clearPendingShift]);

  // Display steps (can enhance this if needed)
  const getDisplaySteps = () => rulerSteps;

  return (
    <SliderContainer>
      <WindowInfo>
        <CurrentValue>Value: {value.toLocaleString()}</CurrentValue>
        <WindowRange>
          Window: {windowStart.toLocaleString()} - {windowEnd.toLocaleString()}
          {isDragging && ' (dragging)'}
          {pendingShift && ' (shifting...)'}
        </WindowRange>
      </WindowInfo>

      <Slider
        id={`${id}-window-${currentWindow}`}
        minValue={windowStart}
        maxValue={windowEnd}
        sliderSteps={sliderSteps}
        rulerSteps={getDisplaySteps()}
        value={value}
        onChange={handleSliderChange}
      />
    </SliderContainer>
  );
};

export default WindowedSliderWrapper;
