import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import styled from 'styled-components';

interface SliderProps {
  minValue: number;
  maxValue: number;
  value: number;
  setValue: (val: number) => void;
  onFinalChange?: (val: number) => void;
  step?: number;
  // Generic props
  logo?: string | React.ReactNode; // Image URL or React component
  label?: string;
  inputLabel?: string;
  isLogo?: boolean;
}

const Container = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 100%;
  padding: 16px;
  margin: 5px;
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  width: 60px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const LogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  background: white;
  border-radius: 4px;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 16px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #000000;
  border-radius: 6px;
  padding: 0;
  min-width: 140px;
  transition: border-color 0.2s ease;
  
  &:focus-within {
    border-color: #030303;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;

const CurrencyLabel = styled.span`
  font-size: 12px;
  padding: 8px 8px 8px 12px;
  margin-right: 4px;

  white-space: nowrap;
`;

const AmountInput = styled.input`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  min-width: 0;
  
  &::placeholder {
    color: #999;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 50px;
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid #333;
  border-radius: 1px;
  cursor: grab;
  background-color: #dbdcdd70;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
  }
`;

const ScaleTrack = styled.div<{ offset: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.offset}px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  transition: none;
  user-select: none;
`;

const TickWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
`;

const TickMark = styled.div<{ height: number }>`
  width: 2px;
  height: ${props => props.height}px;
  background-color: #333;
  flex-shrink: 0;
  border-radius: 1px;
`;

const TickLabel = styled.div`
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 500;
  color: #555;
  margin-top: 2px;
  white-space: nowrap;
`;

const Pointer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background-color: #000000;
  z-index: 10;
  pointer-events: none;
  border-radius: 2px;
`;

const ARROW_LEFT_POSITION = 30;

const ArrowPointer = styled.div`
  position: absolute;
  top: -2px;
  left: ${ARROW_LEFT_POSITION}px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid #000000;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
`;

const WeighingScaleSlider: React.FC<SliderProps> = ({
  minValue,
  maxValue,
  value,
  setValue,
  onFinalChange,
  step,
  logo,
  label = "Purchase Amount",
  inputLabel = "CHF",
  isLogo = true
}) => {

  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const startOffset = useRef(0);

  const actualStep = step || 500;
  const MAJOR_TICK_INTERVAL = 10 * actualStep;
  const MEDIUM_TICK_INTERVAL = 5 * actualStep;
  const PIXELS_PER_STEP = 10;
  const PIXELS_PER_UNIT = PIXELS_PER_STEP / actualStep;
  const TICK_SPACING = 20;
  const LEFT_MARGIN = 20;

  const valueToOffset = (val: number) => {
    return ARROW_LEFT_POSITION - (val - minValue) * PIXELS_PER_UNIT;
  };

  const offsetToValue = (offset: number) => {
    return minValue + (ARROW_LEFT_POSITION - offset) / PIXELS_PER_UNIT;
  };

  const renderLogo = () => {
    if (!isLogo) return null;
    
    if (typeof logo === 'string') {
      // If logo is a string, treat it as an image URL
      return (
        <LogoContainer>
          <LogoImage src={logo} alt="Logo" />
        </LogoContainer>
      );
    } else if (React.isValidElement(logo)) {
      // If logo is a React component
      return (
        <LogoContainer>
          {logo}
        </LogoContainer>
      );
    } else {
      // Default placeholder
      return (
        <LogoContainer>
          <LogoPlaceholder>LOGO</LogoPlaceholder>
        </LogoContainer>
      );
    }
  };

  const formatNumberWithCommas = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(cleaned);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < minValue || numValue > maxValue) {
      setInputValue(value.toString());
    } else {
      setValue(numValue);
      setInputValue(numValue.toString());
      onFinalChange?.(numValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    startOffset.current = valueToOffset(value);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX.current;
    const newOffset = startOffset.current + deltaX;
    const newValue = offsetToValue(newOffset);

    const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
    const snappedValue = Math.round(clampedValue / actualStep) * actualStep;
    const finalValue = Math.max(minValue, Math.min(maxValue, snappedValue));
    setValue(finalValue);
    setInputValue(finalValue.toString());
  }, [isDragging, minValue, maxValue, setValue, actualStep]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onFinalChange?.(value);
    }
  }, [isDragging, value, onFinalChange]);

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

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const renderTicks = () => {
    const ticks = [];
    for (let tickValue = minValue; tickValue <= maxValue; tickValue += actualStep) {
      const isMajorTick = tickValue % MAJOR_TICK_INTERVAL === 0;
      const isMediumTick = tickValue % MEDIUM_TICK_INTERVAL === 0 && !isMajorTick;
      const height = isMajorTick ? 35 : isMediumTick ? 25 : 12;
      const position = Math.round((tickValue - minValue) * PIXELS_PER_UNIT);
      
      ticks.push(
        <TickWrapper
          key={tickValue}
          style={{ position: 'absolute', left: `${position}px` }}
        >
          <TickMark height={height} />
          {isMajorTick && PIXELS_PER_STEP >= 10 && (
            <TickLabel>{tickValue.toLocaleString()}</TickLabel>
          )}
        </TickWrapper>
      );
    }
    return ticks;
  };

  const [currentOffset, setCurrentOffset] = useState(0);

  useLayoutEffect(() => {
    const offset = valueToOffset(value);
    setCurrentOffset(offset);
  }, [value]);

  return (
    <Container>
      <Header>
        <HeaderContainer>
          {renderLogo()}
          <Label>{label}</Label>
        </HeaderContainer>
        <InputContainer>
          <CurrencyLabel>{inputLabel}</CurrencyLabel>
          <AmountInput
            type="text"
            value={formatNumberWithCommas(inputValue)}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="0"
          />
        </InputContainer>
      </Header>

      <SliderContainer ref={containerRef} onMouseDown={handleMouseDown}>
        <ArrowPointer />
        <ScaleTrack offset={currentOffset}>{renderTicks()}</ScaleTrack>
      </SliderContainer>
    </Container>
  );
};

export default WeighingScaleSlider;
