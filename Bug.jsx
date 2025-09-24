useEffect(() => {
    const prev = prevValueRef.current;
    if (value === prev) return;

    let ws = windowStart;

    // ✅ Calculate where the value *should* be
    if (value < windowStart) {
      // Slide window backwards
      ws = Math.max(value - (value % effectiveStep), minValue);
    } else if (value >= windowStart + windowSize) {
      // Slide window forwards
      ws = Math.min(
        value - (value % effectiveStep),
        maxValue - windowSize + 1
      );
    }

    // ✅ Clamp at edges
    if (value >= maxValue - windowSize + 1) {
      ws = Math.max(maxValue - windowSize + 1, minValue);
    }
    if (value <= minValue) {
      ws = minValue;
    }

    if (ws !== windowStart) {
      setWindowStart(ws);
      setSliderKey((prev) => prev + 1); // force re-render
    }

    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);
