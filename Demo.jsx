// SliderComponent.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface SliderProps {
  minValue: number;
  maxValue: number;
  sliderSteps?: number;
  rulerSteps?: number;
}

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 40px 10px 20px;
`;

const StyledSlider = styled.input.attrs({ type: "range" })<{ progress: number }>`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border: 1px solid black;
  background: linear-gradient(
    to right,
    green 0%,
    green ${({ progress }) => progress}%,
    transparent ${({ progress }) => progress}%,
    transparent 100%
  );
  border-radius: 10px;
  position: relative;
  z-index: 2;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    border: 2px solid blue;
    background: white;
    cursor: pointer;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
  }

  &::-moz-range-thumb {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    border: 2px solid blue;
    background: white;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  left: ${({ left }: { left: number }) => `${left}%`};
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
`;

const Ruler = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  z-index: 1;
`;

const Tick = styled.div`
  position: relative;
  width: 1px;
  height: 12px;
  background-color: black;
  &:after {
    content: attr(data-label);
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return `${num}`;
};

const SliderComponent: React.FC<SliderProps> = ({
  minValue,
  maxValue,
  sliderSteps = 1,
  rulerSteps = 5,
}) => {
  const [value, setValue] = useState(minValue);
  const [isSliding, setIsSliding] = useState(false);

  const progress = ((value - minValue) / (maxValue - minValue)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const handleMouseDown = () => setIsSliding(true);
  const handleMouseUp = () => setIsSliding(false);

  const ticks = Array.from({ length: rulerSteps + 1 }, (_, i) => {
    const stepVal = minValue + ((maxValue - minValue) / rulerSteps) * i;
    return {
      position: (stepVal - minValue) / (maxValue - minValue),
      label: formatNumber(Math.round(stepVal)),
    };
  });

  return (
    <SliderWrapper>
      <StyledSlider
        min={minValue}
        max={maxValue}
        step={sliderSteps}
        value={value}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        progress={progress}
      />
      {isSliding && <Tooltip left={progress}>{value}</Tooltip>}
      <Ruler>
        {ticks.map((tick, i) => (
          <Tick
            key={i}
            style={{ left: `${tick.position * 100}%` }}
            data-label={tick.label}
          />
        ))}
      </Ruler>
    </SliderWrapper>
  );
};

export default SliderComponent;
