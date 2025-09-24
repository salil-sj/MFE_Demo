  useEffect(() => {
    let ws: number;

    // 🟢 Compute windowStart directly from value
    if (value <= minValue) {
      ws = minValue;
    } else if (value >= maxValue - windowSize + 1) {
      ws = Math.max(maxValue - windowSize + 1, minValue);
    } else {
      ws =
        Math.floor((value - minValue) / effectiveStep) * effectiveStep +
        minValue;

      // Clamp so window doesn’t exceed maxValue
      if (ws + windowSize - 1 > maxValue) {
        ws = maxValue - windowSize + 1;
      }
    }

    if (ws !== windowStart) {
      setWindowStart(ws);
      setSliderKey((prev) => prev + 1); // force re-render
    }

    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

  const windowEnd = Math.min(windowStart + windowSize - 1, maxValue);
