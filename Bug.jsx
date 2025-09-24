useEffect(() => {
  const prev = prevValueRef.current;
  if (value === prev) return;

  const movingForward = value > prev;
  let ws = windowStart;

  if (movingForward) {
    while (value >= ws + windowSize && ws + effectiveStep <= maxValue) {
      ws = Math.min(ws + effectiveStep, maxValue - windowSize + 1);
      setSliderKey((prev) => prev + 1);
    }
  } else {
    while (value < ws && ws - effectiveStep >= minValue) {
      ws = Math.max(ws - effectiveStep, minValue);
      setSliderKey((prev) => prev + 1);
    }
  }

  // ✅ Clamp near the edges
  if (value > maxValue - windowSize + 1) {
    ws = Math.max(maxValue - windowSize + 1, minValue);
  }
  if (value < minValue + effectiveStep) {
    ws = minValue;
  }

  if (ws !== windowStart) {
    setWindowStart(ws);
  }

  prevValueRef.current = value;
}, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);
