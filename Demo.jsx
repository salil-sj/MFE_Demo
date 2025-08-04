import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface SliderProps {
  minValue: number;
  maxValue: number;
  sliderSteps: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderContainer = styled.div`
  width: 100%;
  padding: 20px 0;
  position: relative;
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  margin-bottom: 40px;
`;

const SliderTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border: 2px solid #000;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const SliderProgress = styled.div<{ percentage: number }>`
  height: 100%;
  background-color: #90ee90;
  width: ${props => props.percentage}%;
  transition: width 0.1s ease;
`;

const SliderThumb = styled.div<{ percentage: number; isDragging: boolean }>`
  position: absolute;
  top: 50%;
  left: ${props => props.percentage}%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: white;
  border: 2px solid #000;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  transition: ${props => props.isDragging ? 'none' : 'left 0.1s ease'};
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Tooltip = styled.div<{ percentage: number; show: boolean }>`
  position: absolute;
  top: -35px;
  left: ${props => Math.max(0, Math.min(100, props.percentage))}%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;
  z-index: 3;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #333;
  }
`;

const RulerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 10px;
`;

const RulerMark = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #666;
  
  &::before {
    content: '';
    width: 1px;
    height: 8px;
    background-color: #666;
    margin-bottom: 4px;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
`;

const formatValue = (value: number): string => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1).replace('.0', '')}Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(1).replace('.0', '')}L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
};

const generateRulerMarks = (min: number, max: number): number[] => {
  const range = max - min;
  const step = range / 3; // 4 marks means 3 intervals
  
  // Smart rounding based on the step size
  let roundingFactor: number;
  if (step >= 10000000) {
    roundingFactor = 1000000; // Round to nearest million for crores
  } else if (step >= 1000000) {
    roundingFactor = 100000; // Round to nearest lakh
  } else if (step >= 100000) {
    roundingFactor = 10000; // Round to nearest 10k
  } else if (step >= 10000) {
    roundingFactor = 1000; // Round to nearest thousand
  } else if (step >= 1000) {
    roundingFactor = 100; // Round to nearest hundred
  } else {
    roundingFactor = 10; // Round to nearest ten
  }
  
  const marks: number[] = [];
  for (let i = 0; i < 4; i++) {
    let mark = min + (i * step);
    mark = Math.round(mark / roundingFactor) * roundingFactor;
    // Ensure marks don't exceed bounds
    mark = Math.max(min, Math.min(max, mark));
    marks.push(mark);
  }
  
  // Ensure the last mark is exactly the max value
  marks[3] = max;
  
  return marks;
};

const CustomSlider: React.FC<SliderProps> = ({
  minValue,
  maxValue,
  sliderSteps,
  value,
  onChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
  
  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    
    const rawValue = minValue + (newPercentage / 100) * (maxValue - minValue);
    const steppedValue = Math.round(rawValue / sliderSteps) * sliderSteps;
    const clampedValue = Math.max(minValue, Math.min(maxValue, steppedValue));
    
    onChange(clampedValue);
  }, [minValue, maxValue, sliderSteps, onChange]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setShowTooltip(true);
    updateValue(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setShowTooltip(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setShowTooltip(true);
    updateValue(e.touches[0].clientX);
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateValue(e.touches[0].clientX);
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      setShowTooltip(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };
  
  const rulerMarks = generateRulerMarks(minValue, maxValue);
  
  // Calculate tooltip position to keep it within bounds
  const tooltipPercentage = Math.max(10, Math.min(90, percentage));
  
  return (
    <SliderContainer>
      <SliderWrapper ref={sliderRef}>
        <SliderTrack>
          <SliderProgress percentage={percentage} />
        </SliderTrack>
        
        <SliderThumb
          percentage={percentage}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <Tooltip percentage={tooltipPercentage} show={showTooltip}>
            {value.toLocaleString()}
          </Tooltip>
        </SliderThumb>
        
        <HiddenInput
          type="range"
          min={minValue}
          max={maxValue}
          step={sliderSteps}
          value={value}
          onChange={handleInputChange}
        />
      </SliderWrapper>
      
      <RulerContainer>
        {rulerMarks.map((mark, index) => (
          <RulerMark key={index}>
            {formatValue(mark)}
          </RulerMark>
        ))}
      </RulerContainer>
    </SliderContainer>
  );
};
