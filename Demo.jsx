import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface RulerSliderProps {
  minValue: number;
  maxValue: number;
  value: number;
  onChange: (val: number) => void;
}

const STEP = 500;
const TICK_WIDTH = 20; // px per tick

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 40px 0;
`;

const RulerWrapper = styled.div`
  position: relative;
  height: 50px;
`;

const Ruler = styled.div<{ width: number; offset: number }>`
  display: flex;
  position: absolute;
  left: ${props => props.offset}px;
  transition: left 0.2s ease;
`;

const Tick = styled.div`
  width: ${TICK_WIDTH}px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    width: 1px;
    height: 12px;
    background-color: #000;
    margin-bottom: 4px;
  }

  span {
    font-size: 10px;
    color: #333;
  }
`;

const Arrow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  color: #000;
`;

const RulerSlider: React.FC<RulerSliderProps> = ({ minValue, maxValue, value, onChange }) => {
  const totalSteps = Math.floor((maxValue - minValue) / STEP);
  const [offset, setOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const center = () => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.offsetWidth;
    const index = (value - minValue) / STEP;
    const offset = containerWidth / 2 - index * TICK_WIDTH;
    setOffset(offset);
  };

  useEffect(() => {
    center();
  }, [value, minValue, maxValue]);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const startOffset = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    startOffset.current = offset;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    const newOffset = startOffset.current + delta;
    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const maxOffset = containerWidth / 2;
    const minOffset = containerWidth / 2 - totalSteps * TICK_WIDTH;
    const clampedOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);
    setOffset(clampedOffset);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    // Snap to nearest
    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const index = Math.round((containerWidth / 2 - offset) / TICK_WIDTH);
    const newValue = minValue + index * STEP;
    onChange(Math.max(minValue, Math.min(maxValue, newValue)));
  };

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i <= totalSteps; i++) {
      const val = minValue + i * STEP;
      ticks.push(
        <Tick key={i}>
          <span>{val.toLocaleString()}</span>
        </Tick>
      );
    }
    return ticks;
  };

  return (
    <Container ref={sliderRef}>
      <Arrow>▼</Arrow>
      <RulerWrapper>
        <Ruler offset={offset} width={(totalSteps + 1) * TICK_WIDTH} onMouseDown={handleMouseDown}>
          {renderTicks()}
        </Ruler>
      </RulerWrapper>
    </Container>
  );
};

export default RulerSlider;
