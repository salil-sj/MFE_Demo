import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface SliderProps {
  minValue: number;
  maxValue: number;
  value: number;
  setValue: (value: number) => void;
  onValueSet?: (value: number) => void;
}

const SliderWrapper = styled.div`
  width: 600px;
  margin: 20px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoPlaceholder = styled.div`
  width: 70px;
  height: 45px;
  border: 2px solid #2c3e50;
  background-color: #ecf0f1;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &::after {
    content: '↓';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
  }
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
`;

const PurchaseText = styled.span`
  font-size: 15px;
  color: #34495e;
  margin-left: 10px;
`;

const AmountBox = styled.input`
  width: 140px;
  height: 40px;
  border: 2px solid #bdc3c7;
  background-color: white;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &::placeholder {
    color: #95a5a6;
    font-weight: normal;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 90px;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ecf0f1 100%);
  border: 2px solid #bdc3c7;
  position: relative;
  overflow: hidden;
  user-select: none;
  cursor: grab;
  border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  
  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    border-color: #95a5a6;
  }
`;

const DownArrow = styled.div`
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 18px solid #e74c3c;
  z-index: 10;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
`;

const ScaleContainer = styled.div<{ offset: number }>`
  position: absolute;
  top: 18px;
  left: 0;
  height: calc(100% - 18px);
  transform: translateX(${props => props.offset}px);
  display: flex;
  align-items: flex-start;
`;

const ScaleLine = styled.div<{ height: number; lineType: 'big' | 'medium' | 'small' }>`
  width: ${props => props.lineType === 'big' ? '3px' : props.lineType === 'medium' ? '2px' : '1px'};
  height: ${props => props.height}px;
  background-color: ${props => props.lineType === 'big' ? '#2c3e50' : props.lineType === 'medium' ? '#34495e' : '#7f8c8d'};
  margin-right: ${props => 50 - (props.lineType === 'big' ? 1.5 : props.lineType === 'medium' ? 1 : 0.5)}px;
  position: relative;
  
  &:last-child {
    margin-right: 0;
  }
`;

const ScaleLabel = styled.div`
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
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

  useEffect(() => {
    setInputValue(value.toLocaleString());
  }, [value]);

  const calculateOffset = useCallback((val: number) => {
    const containerWidth = 600;
    const centerX = containerWidth / 2;
    const pixelsPerUnit = 50 / 500; // 50px per 500 units
    const valueOffset = (val - minValue) * pixelsPerUnit;
    return centerX - valueOffset;
  }, [minValue]);

  const calculateValueFromOffset = useCallback((offset: number) => {
    const containerWidth = 600;
    const centerX = containerWidth / 2;
    const pixelsPerUnit = 50 / 500; // 50px per 500 units
    const valueOffset = (centerX - offset) / pixelsPerUnit;
    const newValue = minValue + valueOffset;
    
    const snappedValue = Math.round(newValue / 500) * 500;
    return Math.max(minValue, Math.min(maxValue, snappedValue));
  }, [minValue, maxValue]);

  const offset = calculateOffset(value);

  const generateScaleMarks = () => {
    const marks = [];
    const totalRange = maxValue - minValue;
    const totalSteps = totalRange / 500; // Each step is 500 units
    
    for (let i = 0; i <= totalSteps; i++) {
      const currentValue = minValue + (i * 500);
      let lineType: 'big' | 'medium' | 'small';
      let height: number;
      
      // Pattern: Big line every 5000 units (every 10 steps of 500)
      // Medium line every 2500 units (every 5 steps of 500)
      // Small lines for everything else
      if (i % 10 === 0) {
        lineType = 'big';
        height = 40;
      } else if (i % 5 === 0) {
        lineType = 'medium';
        height = 25;
      } else {
        lineType = 'small';
        height = 15;
      }
      
      marks.push(
        <ScaleLine 
          key={i} 
          height={height}
          lineType={lineType}
        >
          {lineType === 'big' && (
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
          placeholder="CHF"
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
  const [value2, setValue2] = useState(25000);

  const handleValueSet = (value: number) => {
    console.log('Slider value set to:', value);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#ffffff', minHeight: '100vh' }}>      
      <PrecisionSlider 
        minValue={0}
        maxValue={10000}
        value={value1}
        setValue={setValue1}
        onValueSet={handleValueSet}
      />

      <div style={{ marginTop: '40px' }}>
        <PrecisionSlider 
          minValue={20000}
          maxValue={30000}
          value={value2}
          setValue={setValue2}
          onValueSet={handleValueSet}
        />
      </div>

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#7f8c8d', fontFamily: 'Segoe UI, sans-serif' }}>
        <p><strong>Features:</strong></p>
        <p>• Big lines every 5000 units (0, 5000, 10000...)</p>
        <p>• Medium lines every 2500 units</p>
        <p>• Small lines every 500 units</p>
        <p>• Drag to slide smoothly</p>
        <p>• Type in input box and press Enter</p>
        <p>• Mouse wheel for precise control</p>
      </div>
    </div>
  );
};

export default SliderDemo;
