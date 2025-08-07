// Props for the wrapper
interface WindowedSliderWrapperProps {
  id: string;
  fullMin: number;
  fullMax: number;
  windowSize?: number;
  buffer?: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderContainer = styled.div`
  width: 100%;
  padding: 16px;
  transition: all 0.3s ease;
`;

export const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
  id,
  fullMin,
  fullMax,
  windowSize = 20000,
  buffer = 5000,
  sliderSteps,
  rulerSteps,
  value,
  onChange,
}) => {
  const [windowStart, setWindowStart] = useState(() => {
    const initialStart = Math.max(fullMin, value - windowSize / 2);
    return Math.min(initialStart, fullMax - windowSize);
  });

  const windowEnd = windowStart + windowSize;

  // When value is near start or end, shift the window
  useEffect(() => {
    if (value < windowStart + buffer && windowStart > fullMin) {
      const newStart = Math.max(fullMin, value - windowSize / 2);
      setWindowStart(newStart);
    } else if (value > windowEnd - buffer && windowEnd < fullMax) {
      const newStart = Math.min(fullMax - windowSize, value - windowSize / 2);
      setWindowStart(newStart);
    }
  }, [value, windowStart, windowEnd, fullMin, fullMax, buffer, windowSize]);

  // Clamp the visible value within the current window
  const visibleValue = Math.min(Math.max(value, windowStart), windowEnd);

  return (
    <SliderContainer>
      <Slider
        id={id}
        minValue={Math.round(windowStart)}
        maxValue={Math.round(windowEnd)}
        sliderSteps={sliderSteps}
        rulerSteps={rulerSteps}
        value={Math.round(visibleValue)}
        onChange={(event) => onChange(event.value)}
      />
    </SliderContainer>
  );
};
