useEffect(() => {
    const prev = prevValueRef.current;
    if (value === prev) return;

    const movingForward = value > prev;
    let ws = windowStart;

    if (movingForward) {
      // Move window forward when value exceeds current window bounds
      while (value > ws + windowSize - 1) {
        const nextWindowStart = ws + effectiveStep;
        // Ensure we don't go beyond the point where we can show a meaningful window
        if (nextWindowStart > maxValue - windowSize) {
          ws = maxValue - windowSize;
          break;
        } else {
          ws = nextWindowStart;
        }
        setSliderKey((prev) => prev + 1);
      }
    } else {
      // Move window backward when value is below current window start
      while (value < ws && ws > minValue) {
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
