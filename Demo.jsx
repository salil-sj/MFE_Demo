import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

type SliderProps = {
  minValue: number;
  maxValue: number;
  value: number;
  setValue: (val: number) => void;
};

const Container = styled.div`
  width: 100%;
  height: 60px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  border: 1px solid #ccc;
  cursor: grab;
`;

const Arrow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid black;
  z-index: 2;
`;

const Scale = styled.div<{ offsetX: number }>`
  position: absolute;
  top: 12px;
  left: ${(props) => props.offsetX}px;
  height: 48px;
  display: flex;
  transition: left 0.1s ease-out;
`;

const Tick = styled.div<{ height: number }>`
  width: 1px;
  background: black;
  margin-right: 10px;
  height: ${(props) => props.height}px;
`;

const Label = styled.div`
  position: absolute;
  top: 36px;
  font-size: 10px;
  transform: translateX(-50%);
  color: black;
`;

const CustomSlider: React.FC<SliderProps> = ({ minValue, maxValue, value, setValue }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const step = 500;
  const stepWidth = 10;
  const totalSteps = Math.floor((maxValue - minValue) / step);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startOffset = offsetX;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const diff = moveEvent.clientX - startX;
      let rawOffset = startOffset + diff;

      const maxOffset = 0;
      const minOffset = -totalSteps * stepWidth + containerRef.current.offsetWidth / 2;

      rawOffset = Math.min(maxOffset, Math.max(minOffset, rawOffset));

      const snappedOffset = Math.round(rawOffset / stepWidth) * stepWidth;
      setOffsetX(snappedOffset);

      const sliderVal = minValue + Math.round(((-1 * snappedOffset) + (containerRef.current.offsetWidth / 2)) / stepWidth) * step;
      setValue(Math.min(maxValue, Math.max(minValue, sliderVal)));
    };

    const onMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const initialOffset = -((value - minValue) / step) * stepWidth + (containerRef.current!.offsetWidth / 2);
    setOffsetX(Math.round(initialOffset / stepWidth) * stepWidth);
  }, [value, minValue]);

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i <= totalSteps; i++) {
      const val = minValue + i * step;
      let height = 16;
      if (i % 10 === 0) height = 28;
      else if (i % 5 === 0) height = 22;
      ticks.push(
        <div key={i} style={{ position: 'relative' }}>
          <Tick height={height} />
          {i % 10 === 0 && <Label>{val.toLocaleString()}</Label>}
        </div>
      );
    }
    return ticks;
  };

  return (
    <Container ref={containerRef} onMouseDown={handleMouseDown} style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
      <Arrow />
      <Scale offsetX={offsetX}>{renderTicks()}</Scale>
    </Container>
  );
};

export default CustomSlider;
