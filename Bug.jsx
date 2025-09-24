useEffect(() => {
    const prev = prevValueRef.current;
    if (value === prev) return;

    const movingForward = value > prev;
    let ws = windowStart;

    if (movingForward) {
      // Move window forward if value is at or beyond the current window end
      while (value >= ws + windowSize && ws < maxValue - windowSize) {
        ws = Math.min(ws + effectiveStep, maxValue - windowSize);
        setSliderKey((prev) => prev + 1);
      }
    } else {
      // Move window backward if value is at or before the current window start
      while (value <= ws && ws > minValue) {
        ws = Math.max(ws - effectiveStep, minValue);
        setSliderKey((prev) => prev + 1);
      }
    }

    if (ws !== windowStart) {
      setWindowStart(ws);
    }
    
    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);
