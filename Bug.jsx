  useEffect(() => {
    const prev = prevValueRef.current;
    if (value === prev) return;

    const movingForward = value > prev;
    let ws = windowStart;
    let windowMoved = false;

    if (movingForward) {
      // Move window forward when value exceeds current window bounds
      while (value > ws + windowSize - 1) {
        const nextWindowStart = ws + effectiveStep;
        // Ensure we don't go beyond the point where we can show a meaningful window
        if (nextWindowStart > maxValue - windowSize) {
          const newWs = maxValue - windowSize;
          if (newWs !== ws) {
            ws = newWs;
            windowMoved = true;
          }
          break;
        } else {
          ws = nextWindowStart;
          windowMoved = true;
        }
      }
    } else {
      // Move window backward when value is below current window bounds
      while (value < ws) {
        const nextWindowStart = ws - effectiveStep;
        // Ensure we don't go below minValue
        if (nextWindowStart < minValue) {
          const newWs = minValue;
          if (newWs !== ws) {
            ws = newWs;
            windowMoved = true;
          }
          break;
        } else {
          ws = nextWindowStart;
          windowMoved = true;
        }
      }
    }

    if (ws !== windowStart) {
      setWindowStart(ws);
    }
    
    if (windowMoved) {
      setSliderKey((prev) => prev + 1);
    }
    
    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);
