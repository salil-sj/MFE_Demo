import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import styled from 'styled-components';

interface SliderProps {
  minValue: number;
  maxValue: number;
  value: number;
  setValue: (val: number) => void;
  onFinalChange?: (val: number) => void;
}

const Container = styled.div`
  flex: 1;
  min-width: 260px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 6px;
  margin: 5px;
  display: flex;
  flex-direction: column;
`;

const LogoPlaceholder = styled.div`
  width: 60px;
  height: 20px;
  border: 2px solid #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: white;
  
  /* &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #333;
  } */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; // reduced
  position: relative;
`;

const PurchaseAmount = styled.div`
  font-size: 14px; // reduced
`;

const AmountInput = styled.input`
  width: 100%;
  max-width: 120px;
  font-size: 12px; // reduced
  padding: 4px 6px;
  text-align: center;
  border-radius: 4px;
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 40px; // reduced from 60px
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid #333;
  cursor: grab;
  background-color: #d6d3d32c;

  &:active {
    cursor: grabbing;
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
  width: 1.5px;
  height: ${props => props.height}px;
  background-color: #333;
  flex-shrink: 0;
`;
const TickLabel = styled.div`
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  font-size: 8px; // reduced
  color: #000000;
`;


const Pointer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px; /* <- increased from 2px */
  height: 100%;
  background-color: #c60303;
  z-index: 10;
  pointer-events: none;
`;

const ARROW_LEFT_POSITION = 30;

const ArrowPointer = styled.div`
  position: absolute;
  top: 0;
  left: ${ARROW_LEFT_POSITION}px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #000000; // smaller arrow
  z-index: 10;
  pointer-events: none;
`;

const WeighingScaleSlider: React.FC<SliderProps> = ({
  minValue,
  maxValue,
  value,
  setValue,
  onFinalChange
}) => {

  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const startOffset = useRef(0);

  const STEP = 500;
  const MAJOR_TICK_INTERVAL = 5000;
  const PIXELS_PER_UNIT = 0.02; // Adjust for spacing
  const TICK_SPACING = 20;
  const LEFT_MARGIN = 20; // margin from the left of the container

const valueToOffset = (val: number) => {
  return ARROW_LEFT_POSITION - (val - minValue) * PIXELS_PER_UNIT;
};

const offsetToValue = (offset: number) => {
  return minValue + (ARROW_LEFT_POSITION - offset) / PIXELS_PER_UNIT;
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
const snappedValue = Math.round(clampedValue / STEP) * STEP;
const finalValue = Math.max(minValue, Math.min(maxValue, snappedValue));
setValue(finalValue);
setInputValue(finalValue.toString());
  }, [isDragging, minValue, maxValue, setValue]);

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
  for (let tickValue = minValue; tickValue <= maxValue; tickValue += STEP) {
    const isMajorTick = tickValue % MAJOR_TICK_INTERVAL === 0;
    const isMediumTick = tickValue % 2500 === 0 && !isMajorTick;

    const height = isMajorTick ? 30 : isMediumTick ? 20 : 10;
    const position = Math.round((tickValue - minValue) * PIXELS_PER_UNIT);

    console.log("Tick at:", tickValue); // ✅ Add this temporarily

    ticks.push(
      <TickWrapper
        key={tickValue}
        style={{ position: 'absolute', left: `${position}px` }}
      >
        <TickMark height={height} />
        {isMajorTick && <TickLabel>{tickValue.toLocaleString()}</TickLabel>}
      </TickWrapper>
    );
  }

  return ticks;
   
  };

  const [currentOffset, setCurrentOffset] = useState(0);

//   useEffect(() => {
//   const container = containerRef.current;
//   if (container) {
//     const offset = valueToOffset(value);
//     container.scrollLeft = -offset;
//   }
// }, [containerRef.current]); //

useLayoutEffect(() => {
  const offset = valueToOffset(value);
  setCurrentOffset(offset);
}, [value]);

  return (
    <Container>
      <Header>
        <HeaderContainer>
        <LogoPlaceholder />
        <PurchaseAmount>Purchase Amount</PurchaseAmount>
        </HeaderContainer>
        <AmountInput
          type="text"
          value={`CHF ${inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      </Header>

      <SliderContainer ref={containerRef} onMouseDown={handleMouseDown}>
       
        <ArrowPointer />
        <ScaleTrack offset={currentOffset}>{renderTicks()}</ScaleTrack>
      </SliderContainer>
    </Container>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  gap: 10px;
`

export default WeighingScaleSlider;
