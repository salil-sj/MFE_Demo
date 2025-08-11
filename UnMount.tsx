const windowUpdateTimeoutRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  const prev = prevValueRef.current;
  if (value === prev) return;

  const movingForward = value > prev;
  let ws = windowStart;

  if (movingForward) {
    while (value >= ws + windowSize && ws + effectiveStep <= maxValue - windowSize) {
      ws = Math.min(ws + effectiveStep, maxValue - windowSize);
    }
  } else {
    while (value <= ws && ws - effectiveStep >= minValue) {
      ws = Math.max(ws - effectiveStep, minValue);
    }
  }

  if (ws !== windowStart) {
    // Clear any pending updates
    if (windowUpdateTimeoutRef.current) {
      clearTimeout(windowUpdateTimeoutRef.current);
    }
    
    // Delay the window update to let slider finish any ongoing interactions
    windowUpdateTimeoutRef.current = setTimeout(() => {
      setWindowStart(ws);
    }, 150);
  }

  prevValueRef.current = value;
}, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (windowUpdateTimeoutRef.current) {
      clearTimeout(windowUpdateTimeoutRef.current);
    }
  };
}, []);
