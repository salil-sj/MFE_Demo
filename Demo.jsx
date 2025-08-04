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
  height: 100px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  border: 1px solid #ccc;
`;

const Arrow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid black;
  z-index: 2;
`;

const Scale = styled.div<{ offsetX: number }>`
  position: absolute;
  top: 20px;
  left: ${(props) => props.offsetX}px;
  height: 80px;
  display: flex;
`;

const Tick = styled.div<{ height: number }>`
  width: 2px;
  background: black;
  margin-right: 18px;
  height: ${(props) => props.height}px;
`;

const Label = styled.div`
  position: absolute;
  top: 60px;
  font-size: 12px;
  transform: translateX(-50%);
  color: black;
`;

const CustomSlider: React.FC<SliderProps> = ({ minValue, maxValue, value, setValue }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);

  const step = 500;
  const totalSteps = Math.floor((maxValue - minValue) / step);
  const stepWidth = 20; // 500px == 20px

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startOffset = offsetX;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      let newOffset = startOffset + diff;

      const maxOffset = 0;
      const minOffset = -totalSteps * stepWidth + (containerRef.current?.offsetWidth || 0) / 2;

      newOffset = Math.min(maxOffset, Math.max(minOffset, newOffset));
      setOffsetX(newOffset);

      const sliderVal = minValue + Math.round(((-1 * newOffset) + (containerRef.current!.offsetWidth / 2)) / stepWidth) * step;
      setValue(Math.min(maxValue, Math.max(minValue, sliderVal)));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const initialOffset = -((value - minValue) / step) * stepWidth + (containerRef.current!.offsetWidth / 2);
    setOffsetX(initialOffset);
  }, [value, minValue]);

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i <= totalSteps; i++) {
      const val = minValue + i * step;
      let height = 20;
      if (i % 10 === 0) height = 40;
      else if (i % 5 === 0) height = 30;
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
    <Container ref={containerRef} onMouseDown={handleDrag}>
      <Arrow />
      <Scale offsetX={offsetX}>{renderTicks()}</Scale>
    </Container>
  );
};

export default CustomSlider;
