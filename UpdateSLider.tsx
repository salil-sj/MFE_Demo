const handleSliderChange = useCallback(
  (event: { value: number }) => {
    const newGlobalValue = Math.max(minValue, Math.min(maxValue, event.value));
    lastChangeRef.current = Date.now();
    onChange({ value: newGlobalValue });

    if (!isDraggingRef.current) {
      const newWindow = getWindowForValue(newGlobalValue);
      if (newWindow !== currentWindow) {
        scheduleWindowShift(newWindow);
      }
    }
  },
  [minValue, maxValue, onChange, currentWindow, getWindowForValue, scheduleWindowShift]
);
