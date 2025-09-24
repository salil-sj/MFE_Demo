  const [windowStart, setWindowStart] = useState(minValue);
  const prevValueRef = useRef(value);
  const [sliderKey, setSliderKey] = useState(0);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (value === prev) return;

    const movingForward = value > prev;
    let ws = windowStart;

    if (movingForward) {
      // Fixed condition: allow window to move as long as there's space beyond current window
      while (value >= ws + windowSize && ws < maxValue - windowSize) {
        ws = Math.min(ws + effectiveStep, maxValue - windowSize);
        setSliderKey((prev) => prev + 1);
      }
    } else {
      while (value <= ws && ws - effectiveStep >= minValue) {
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
