import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Your existing Slider component interface (unchanged)
interface SliderProps {
  id: string;
  minValue: number;
  maxValue: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange?: (value: number) => void;
}

// Mock of your existing Slider component for demo purposes
// Replace this with your actual <Slider /> component import
const Slider: React.FC<SliderProps> = ({ id, minValue, maxValue, sliderSteps, rulerSteps, value, onChange }) => {
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const range = maxValue - minValue;
  
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const sliderWidth = rect.width - 20;
    const relativeX = (clickX - 10) / sliderWidth;
    const clampedX = Math.max(0, Math.min(1, relativeX));
    const newValue = minValue + (clampedX * range);
    onChange(Math.round(newValue));
  };

  const rulerTicks = [];
  const step = range / (rulerSteps - 1);
  for (let i = 0; i < rulerSteps; i++) {
    const tickValue = minValue + (i * step);
    rulerTicks.push(Math.round(tickValue));
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '60px',
      background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%)',
      borderRadius: '8px',
      cursor: 'pointer',
      overflow: 'hidden'
    }} onClick={handleClick}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '10px',
        right: '10px',
        height: '4px',
        background: '#ddd',
        borderRadius: '2px',
        transform: 'translateY(-50%)'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: `${10 + (normalizedValue * 80)}%`,
        width: '20px',
        height: '20px',
        background: '#007bff',
        border: '2px solid white',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'grab',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5px',
        left: '10px',
        right: '10px',
        height: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        {rulerTicks.map((tick, index) => (
          <div key={index} style={{
            fontSize: '10px',
            color: '#666',
            textAlign: 'center',
            minWidth: '20px'
          }}>
            {tick.toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
};

// Transition animation
const slideTransition = keyframes`
  0% {
    opacity: 0.7;
    transform: scale(0.98);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled wrapper container
const WindowedSliderContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const SliderWrapper = styled.div<{ isTransitioning: boolean }>`
  position: relative;
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.isTransitioning && `
    animation: ${slideTransition} 400ms ease-out;
  `}
`;

const TransitionIndicator = styled.div<{ show: boolean }>`
  position: absolute;
  top: -5px;
  right: 0;
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 200ms ease;
  z-index: 10;
`;

const SliderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ValueDisplay = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const RangeDisplay = styled.div`
  font-size: 12px;
  color: #666;
`;

const WindowInfo = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 8px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Main WindowedSlider wrapper component
interface WindowedSliderProps {
  id: string;
  value: number;
  minValue: number;
  maxValue: number;
  windowSize?: number;
  bufferSize?: number;
  sliderSteps?: number;
  rulerSteps?: number;
  onChange?: (value: number) => void;
}

const WindowedSlider: React.FC<WindowedSliderProps> = ({
  id,
  value,
  minValue,
  maxValue,
  windowSize = 20000,
  bufferSize = 5000,
  sliderSteps = 100,
  rulerSteps = 5,
  onChange
}) => {
  const [windowStart, setWindowStart] = useState<number>(minValue);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate current window bounds
  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  const actualWindowStart = Math.max(minValue, Math.min(windowStart, maxValue - windowSize));
  
  // Initialize window position to center around the initial value
  useEffect(() => {
    const centeredStart = Math.max(minValue, Math.min(value - windowSize / 2, maxValue - windowSize));
    setWindowStart(centeredStart);
  }, [minValue, maxValue, windowSize]); // Only run on mount and prop changes

  // Function to smoothly adjust window
  const adjustWindow = useCallback((newStart: number) => {
    const clampedStart = Math.max(minValue, Math.min(newStart, maxValue - windowSize));
    
    if (clampedStart !== windowStart) {
      setIsTransitioning(true);
      setWindowStart(clampedStart);
      
      // Clear existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Set new timeout to end transition
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }
  }, [windowStart, minValue, maxValue, windowSize]);

  // Handle slider value changes and determine if window should shift
  const handleSliderChange = useCallback((newValue: number) => {
    const currentWindowStart = actualWindowStart;
    const currentWindowEnd = windowEnd;
    
    // Check if we need to shift the window
    const distanceFromEnd = currentWindowEnd - newValue;
    const distanceFromStart = newValue - currentWindowStart;
    
    let needsShift = false;
    let newWindowStart = currentWindowStart;
    
    // Shift forward if approaching end
    if (distanceFromEnd <= bufferSize && currentWindowEnd < maxValue) {
      const shiftAmount = Math.min(bufferSize, maxValue - currentWindowEnd);
      newWindowStart = Math.min(currentWindowStart + shiftAmount, maxValue - windowSize);
      needsShift = true;
    }
    // Shift backward if approaching start
    else if (distanceFromStart <= bufferSize && currentWindowStart > minValue) {
      const shiftAmount = Math.min(bufferSize, currentWindowStart - minValue);
      newWindowStart = Math.max(currentWindowStart - shiftAmount, minValue);
      needsShift = true;
    }
    
    if (needsShift) {
      adjustWindow(newWindowStart);
    }
    
    // Always call the parent onChange with the actual value
    onChange?.(newValue);
  }, [actualWindowStart, windowEnd, bufferSize, maxValue, minValue, windowSize, adjustWindow, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Calculate the slider value within the current window
  const windowedValue = Math.max(actualWindowStart, Math.min(windowEnd, value));
  
  // Calculate dynamic ruler steps for better readability
  const windowRange = windowEnd - actualWindowStart;
  const dynamicRulerSteps = windowRange > 100000 ? 4 : windowRange > 10000 ? 5 : rulerSteps;

  return (
    <WindowedSliderContainer>
      <SliderInfo>
        <ValueDisplay>
          Value: {value.toLocaleString()}
        </ValueDisplay>
        <RangeDisplay>
          Full Range: {minValue.toLocaleString()} - {maxValue.toLocaleString()}
        </RangeDisplay>
      </SliderInfo>
      
      <SliderWrapper isTransitioning={isTransitioning}>
        <TransitionIndicator show={isTransitioning}>
          Adjusting Window
        </TransitionIndicator>
        
        {/* Your existing Slider component */}
        <Slider
          id={`${id}-windowed`}
          minValue={actualWindowStart}
          maxValue={windowEnd}
          sliderSteps={sliderSteps}
          rulerSteps={dynamicRulerSteps}
          value={windowedValue}
          onChange={handleSliderChange}
        />
      </SliderWrapper>
      
      <WindowInfo>
        <span>Window: {actualWindowStart.toLocaleString()} - {windowEnd.toLocaleString()}</span>
        <span>Range: {windowRange.toLocaleString()} units</span>
      </WindowInfo>
    </WindowedSliderContainer>
  );
};

// Demo component showing usage
const DemoContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #555;
  font-size: 18px;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const App: React.FC = () => {
  const [value1, setValue1] = useState<number>(150000);
  const [value2, setValue2] = useState<number>(2500000);
  const [value3, setValue3] = useState<number>(50);

  return (
    <DemoContainer>
      <Title>WindowedSlider Wrapper Component</Title>
      
      <Section>
        <SectionTitle>Large Range Example (0 - 1,000,000)</SectionTitle>
        <Description>
          Window size: 100k units, Buffer: 20k units. 
          Try dragging near the edges to see smooth window transitions.
        </Description>
        <WindowedSlider
          id="large-range"
          value={value1}
          minValue={0}
          maxValue={1000000}
          windowSize={100000}
          bufferSize={20000}
          onChange={setValue1}
          sliderSteps={200}
          rulerSteps={6}
        />
      </Section>

      <Section>
        <SectionTitle>Extra Large Range (0 - 10,000,000)</SectionTitle>
        <Description>
          Window size: 200k units, Buffer: 50k units. 
          Notice how ruler steps adjust dynamically for better readability.
        </Description>
        <WindowedSlider
          id="extra-large"
          value={value2}
          minValue={0}
          maxValue={10000000}
          windowSize={200000}
          bufferSize={50000}
          onChange={setValue2}
          sliderSteps={150}
          rulerSteps={5}
        />
      </Section>

      <Section>
        <SectionTitle>Small Range (0 - 100)</SectionTitle>
        <Description>
          Window size: 40 units, Buffer: 8 units. 
          Shows the wrapper works well with smaller ranges too.
        </Description>
        <WindowedSlider
          id="small-range"
          value={value3}
          minValue={0}
          maxValue={100}
          windowSize={40}
          bufferSize={8}
          onChange={setValue3}
          sliderSteps={50}
          rulerSteps={5}
        />
      </Section>
    </DemoContainer>
  );
};

export default App;
