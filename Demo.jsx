import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface SliderProps {
  minValue: number;
  maxValue: number;
  value: number;
  setValue: (value: number) => void;
  onValueSet?: (value: number) => void; // Called when slider is released
}

const SliderWrapper = styled.div`
  width: 600px;
  margin: 20px 0;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoPlaceholder = styled.div`
  width: 60px;
  height: 40px;
  border: 2px solid #333;
  background-color: #f8f9fa;
  position: relative;
  
  &::after {
    content: '↓';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    font-weight: bold;
  }
`;

const LogoText = styled.span`
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
`;

const PurchaseText = styled.span`
  font-family: Arial, sans-serif;
  font-size: 14px;
  margin-left: 20px;
`;

const AmountBox = styled.input`
  width: 120px;
  height: 35px;
  border: 2px solid #333;
  background-color: white;
  padding: 5px 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: left;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 80px;
  background-color: #f8f9fa;
  border: 2px solid #333;
  position: relative;
  overflow: hidden;
  user-select: none;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const DownArrow = styled.div`
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 16px solid #333;
  z-index: 10;
`;

const ScaleContainer = styled.div<{ offset: number }>`
  position: absolute;
  top: 16px;
  left: 0;
  height: calc(100% - 16px);
  transform: translateX(${props => props.offset}px);
  display: flex;
  align-items: flex-start;
`;

const ScaleLine = styled.div<{ height: number; isBig?: boolean }>`
  width: 2px;
  height: ${props => props.height}px;
  background-color: #333;
  margin-right: 98px;
  position: relative;
  
  &:last-child {
    margin-right: 0;
  }
`;

const ScaleLabel = styled.div`
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
`;

const PrecisionSlider: React.FC<SliderProps> = ({ 
  minValue, 
  maxValue, 
  value, 
  setValue, 
  onValueSet 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [initialOffset, setInitialOffset] = useState(0);
  const [inputValue, setInputValue] = useState(value.toString());

  // Update input value when slider value changes
  useEffect(() => {
    setInputValue(value.toLocaleString());
  }, [value]);

  // Calculate the offset based on current value
  const calculateOffset = useCallback((val: number) => {
    const containerWidth = 600;
    const centerX = containerWidth / 2;
    const pixelsPerUnit = 100 / 500;
    const valueOffset = (val - minValue) * pixelsPerUnit;
    return centerX - valueOffset;
  }, [minValue]);

  // Calculate value from offset
  const calculateValueFromOffset = useCallback((offset: number) => {
    const containerWidth = 600;
    const centerX = containerWidth / 2;
    const pixelsPerUnit = 100 / 500;
    const valueOffset = (centerX - offset) / pixelsPerUnit;
    const newValue = minValue + valueOffset;
    
    // Snap to nearest 500 increment
    const snappedValue = Math.round(newValue / 500) * 500;
    return Math.max(minValue, Math.min(maxValue, snappedValue));
  }, [minValue, maxValue]);

  const offset = calculateOffset(value);

  // Generate scale marks
  const generateScaleMarks = () => {
    const marks = [];
    const totalRange = maxValue - minValue;
    const steps = totalRange / 500;
    
    for (let i = 0; i <= steps; i++) {
      const currentValue = minValue + (i * 500);
      const isBigLine = i % 2 === 0;
      
      marks.push(
        <ScaleLine 
          key={i} 
          height={isBigLine ? 30 : 15}
          isBig={isBigLine}
        >
          {isBigLine && (
            <ScaleLabel>
              {currentValue.toLocaleString()}
            </ScaleLabel>
          )}
        </ScaleLine>
      );
    }
    
    return marks;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setInitialOffset(offset);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart;
    const newOffset = initialOffset + deltaX;
    const newValue = calculateValueFromOffset(newOffset);
    setValue(newValue);
  }, [isDragging, dragStart, initialOffset, calculateValueFromOffset, setValue]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Call the callback function when slider is released
      if (onValueSet) {
        onValueSet(value);
      }
    }
  }, [isDragging, value, onValueSet]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 500 : -500;
    const newValue = Math.max(minValue, Math.min(maxValue, value + delta));
    setValue(newValue);
    if (onValueSet) {
      onValueSet(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const numericValue = parseFloat(inputValue.replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        const snappedValue = Math.round(numericValue / 500) * 500;
        const clampedValue = Math.max(minValue, Math.min(maxValue, snappedValue));
        setValue(clampedValue);
        if (onValueSet) {
          onValueSet(clampedValue);
        }
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <SliderWrapper>
      <TopSection>
        <LogoSection>
          <LogoPlaceholder />
          <LogoText>Logo Placeholder</LogoText>
          <PurchaseText>Purchase Amount</PurchaseText>
        </LogoSection>
        <AmountBox 
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          placeholder="CMF"
        />
      </TopSection>
      
      <SliderContainer 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <DownArrow />
        <ScaleContainer offset={offset}>
          {generateScaleMarks()}
        </ScaleContainer>
      </SliderContainer>
    </SliderWrapper>
  );
};

// Demo component
const SliderDemo: React.FC = () => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(20000);

  const handleValueSet = (value: number) => {
    console.log('Slider value set to:', value);
    // This function is called when the slider is released
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#fff' }}>
      <h3 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>Initially:</h3>
      
      <PrecisionSlider 
        minValue={0}
        maxValue={10000}
        value={value1}
        setValue={setValue1}
        onValueSet={handleValueSet}
      />

      <h3 style={{ marginBottom: '20px', marginTop: '40px', fontFamily: 'Arial, sans-serif' }}>Logo Placeholder</h3>
      
      <PrecisionSlider 
        minValue={20000}
        maxValue={30000}
        value={value2}
        setValue={setValue2}
        onValueSet={handleValueSet}
      />

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
        <p>• Drag to slide the scale left/right</p>
        <p>• Use mouse wheel for precise control</p>
        <p>• Type amount in input box and press Enter to set value</p>
        <p>• Values snap to 500-unit increments</p>
        <p>• onValueSet callback is triggered when slider is released</p>
      </div>
    </div>
  );
};

export default SliderDemo;
