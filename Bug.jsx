useEffect(() => {
  const prev = prevValueRef.current;
  if (value === prev) return;

  const movingForward = value > prev;
  let ws = windowStart;

  if (movingForward) {
    // Move window forward
    while (value >= ws + windowSize && ws < maxValue - windowSize + 1) {
      ws = Math.min(ws + effectiveStep, maxValue - windowSize + 1);
      setSliderKey((prev) => prev + 1);
    }
  } else {
    // Move window backward
    while (value < ws && ws > minValue) {
      ws = Math.max(ws - effectiveStep, minValue);
      setSliderKey((prev) => prev + 1);
    }
  }

  // ✅ Clamp at the edges
  if (value >= maxValue - windowSize + 1) {
    ws = Math.max(maxValue - windowSize + 1, minValue);
  }
  if (value <= minValue) {
    ws = minValue;
  }

  if (ws !== windowStart) {
    setWindowStart(ws);
  }

  prevValueRef.current = value;
}, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);
