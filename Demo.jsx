import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';

// Mock Slider component for demonstration
const MockSlider = styled.div<{ 
  isTransitioning?: boolean;
  transitionDuration?: number;
}>`
  position: relative;
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  
  ${props => props.isTransitioning && css`
    transition: all ${props.transitionDuration || 300}ms ease-out;
  `}
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  transform: translateY(-50%);
`;

const SliderThumb = styled.div<{ position: number; isTransitioning?: boolean; transitionDuration?: number }>`
  position: absolute;
  top: 50%;
  left: ${props => 10 + (props.position * (100 - 20))}%;
  width: 20px;
  height: 20px;
  background: #007bff;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  ${props => props.isTransitioning && css`
    transition: all ${props.transitionDuration || 300}ms ease-out;
  `}
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  &:active {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

const RulerContainer = styled.div`
  position: absolute;
  bottom: 5px;
  left: 10px;
  right: 10px;
  height: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const RulerTick = styled.div`
  font-size: 10px;
  color: #666;
  text-align: center;
  min-width: 20px;
`;

// Internal Slider Component (your existing component)
interface SliderProps {
  id: string;
  minValue: number;
  maxValue: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange?: (value: number) => void;
  isTransitioning?: boolean;
  transitionDuration?: number;
}

const Slider: React.FC<SliderProps> = ({ 
  id, 
  minValue, 
  maxValue, 
  sliderSteps, 
  rulerSteps, 
  value, 
  onChange,
  isTransitioning = false,
  transitionDuration = 300
}) => {
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const range = maxValue - minValue;
  
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const sliderWidth = rect.width - 20; // Account for padding
    const relativeX = (clickX - 10) / sliderWidth;
    const clampedX = Math.max(0, Math.min(1, relativeX));
    const newValue = minValue + (clampedX * range);
    
    onChange(Math.round(newValue));
  };

  // Generate ruler ticks
  const rulerTicks = useMemo(() => {
    const ticks = [];
    const step = range / (rulerSteps - 1);
    
    for (let i = 0; i < rulerSteps; i++) {
      const tickValue = minValue + (i * step);
      ticks.push(Math.round(tickValue));
    }
    return ticks;
  }, [minValue, maxValue, rulerSteps, range]);

  return (
    <MockSlider 
      onClick={handleClick}
      isTransitioning={isTransitioning}
      transitionDuration={transitionDuration}
    >
      <SliderTrack />
      <SliderThumb 
        position={normalizedValue}
        isTransitioning={isTransitioning}
        transitionDuration={transitionDuration}
      />
      <RulerContainer>
        {rulerTicks.map((tick, index) => (
          <RulerTick key={index}>
            {tick.toLocaleString()}
          </RulerTick>
        ))}
      </RulerContainer>
    </MockSlider>
  );
};

// Styled Components for the wrapper
const WindowedSliderContainer = styled.div`
  width: 100%;
  margin: 20px 0;
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
  margin-top: 5px;
  text-align: center;
`;

// Main Wrapper Component Types
interface WindowedSliderProps {
  id: string;
  value: number;
  minValue: number;
  maxValue: number;
  windowSize?: number;
  bufferSize?: number;
  sliderSteps?: number;
  rulerSteps?: number;
  transitionDuration?: number;
  onChange?: (value: number) => void;
}

// WindowedSlider Component
const WindowedSlider: React.FC<WindowedSliderProps> = ({
  id,
  value,
  minValue,
  maxValue,
  windowSize = 20000,
  bufferSize = 5000,
  sliderSteps = 100,
  rulerSteps = 5,
  transitionDuration = 300,
  onChange
}) => {
  const [windowStart, setWindowStart] = useState<number>(minValue);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // Calculate current window bounds
  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  const actualWindowStart = Math.max(minValue, windowEnd - windowSize);
  
  // Smooth window adjustment with transition
  const adjustWindow = useCallback((newStart: number, withTransition: boolean = true) => {
    const clampedStart = Math.max(minValue, Math.min(newStart, maxValue - windowSize));
    
    if (withTransition && clampedStart !== windowStart) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), transitionDuration);
    }
    
    setWindowStart(clampedStart);
  }, [windowStart, minValue, maxValue, windowSize, transitionDuration]);

  // Initialize window position based on initial value
  useEffect(() => {
    if (value < actualWindowStart || value > windowEnd) {
      const centeredStart = value - windowSize / 2;
      adjustWindow(centeredStart, false);
    }
  }, [value, actualWindowStart, windowEnd, windowSize, adjustWindow]);

  // Handle value changes and window shifting
  const handleSliderChange = useCallback((newValue: number) => {
    // Check if we need to shift the window
    const needsShiftForward = newValue > (windowEnd - bufferSize);
    const needsShiftBackward = newValue < (actualWindowStart + bufferSize);
    
    if (needsShiftForward && windowEnd < maxValue) {
      const newStart = Math.min(
        maxValue - windowSize,
        windowStart + Math.min(bufferSize, maxValue - windowEnd)
      );
      adjustWindow(newStart, true);
    } else if (needsShiftBackward && actualWindowStart > minValue) {
      const newStart = Math.max(
        minValue,
        windowStart - Math.min(bufferSize, actualWindowStart - minValue)
      );
      adjustWindow(newStart, true);
    }
    
    onChange?.(newValue);
  }, [
    windowEnd, 
    actualWindowStart, 
    bufferSize, 
    windowStart, 
    windowSize, 
    maxValue, 
    minValue, 
    adjustWindow, 
    onChange
  ]);

  // Calculate the windowed value for the internal slider
  const windowedValue = Math.max(actualWindowStart, Math.min(windowEnd, value));
  
  return (
    <WindowedSliderContainer>
      <SliderInfo>
        <ValueDisplay>
          Value: {value.toLocaleString()}
        </ValueDisplay>
        <RangeDisplay>
          Range: {minValue.toLocaleString()} - {maxValue.toLocaleString()}
        </RangeDisplay>
      </SliderInfo>
      
      <Slider
        id={id}
        minValue={actualWindowStart}
        maxValue={windowEnd}
        sliderSteps={sliderSteps}
        rulerSteps={rulerSteps}
        value={windowedValue}
        onChange={handleSliderChange}
        isTransitioning={isTransitioning}
        transitionDuration={transitionDuration}
      />
      
      <WindowInfo>
        Current window: {actualWindowStart.toLocaleString()} - {windowEnd.toLocaleString()}
        {isTransitioning && " (transitioning...)"}
      </WindowInfo>
    </WindowedSliderContainer>
  );
};

// Demo Component
const DemoContainer = styled.div`
  max-width: 800px;
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
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #555;
`;

const App: React.FC = () => {
  const [value1, setValue1] = useState<number>(50000);
  const [value2, setValue2] = useState<number>(500000);
  const [value3, setValue3] = useState<number>(75);

  return (
    <DemoContainer>
      <Title>Windowed Slider Component Demo</Title>
      
      <Section>
        <SectionTitle>Large Range Example (0 - 1,000,000)</SectionTitle>
        <WindowedSlider
          id="large-range"
          value={value1}
          minValue={0}
          maxValue={1000000}
          windowSize={50000}
          bufferSize={10000}
          onChange={setValue1}
          rulerSteps={6}
        />
      </Section>

      <Section>
        <SectionTitle>Extra Large Range (0 - 10,000,000)</SectionTitle>
        <WindowedSlider
          id="extra-large"
          value={value2}
          minValue={0}
          maxValue={10000000}
          windowSize={100000}
          bufferSize={20000}
          onChange={setValue2}
          rulerSteps={5}
          transitionDuration={400}
        />
      </Section>

      <Section>
        <SectionTitle>Small Range for Comparison (0 - 100)</SectionTitle>
        <WindowedSlider
          id="small-range"
          value={value3}
          minValue={0}
          maxValue={100}
          windowSize={30}
          bufferSize={5}
          onChange={setValue3}
          rulerSteps={4}
        />
      </Section>
    </DemoContainer>
  );
};

export default App;
