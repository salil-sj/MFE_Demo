const handleSliderChange = useCallback(
  (event: { value: number }) => {
    const newGlobalValue = Math.max(minValue, Math.min(maxValue, event.value));
    lastChangeRef.current = Date.now();
    onChange({ value: newGlobalValue });

    if (!isDraggingRef.current) {
      const lowerShiftPoint = windowStart + windowSize * (1 - shiftThreshold);
      const upperShiftPoint = windowStart + windowSize * shiftThreshold;

      if (newGlobalValue < windowStart + windowSize * shiftThreshold && currentWindow > 0) {
        // Value moved close to start of window -> consider going to previous window
        const newWindow = getWindowForValue(newGlobalValue);
        if (newWindow !== currentWindow && newWindow < currentWindow) {
          scheduleWindowShift(newWindow);
        }
      } else if (newGlobalValue > windowStart + windowSize * (1 - shiftThreshold) && currentWindow < maxWindow) {
        // Value moved close to end of window -> consider going to next window
        const newWindow = getWindowForValue(newGlobalValue);
        if (newWindow !== currentWindow && newWindow > currentWindow) {
          scheduleWindowShift(newWindow);
        }
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
    getWindowForValue
  ]
);
