import React, { useState } from 'react';
import styled from 'styled-components';

interface SliderProps {
  minValue?: number;
  maxValue: number;
  sliderSteps?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const SliderContainer = styled.div`
  width: 100%;
  padding: 30px 10px;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  appearance: none;
  background: transparent;
  height: 8px;
  position: relative;
  z-index: 2;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background-color: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background-color: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    background: transparent;
  }

  &::-moz-range-track {
    height: 8px;
    background: transparent;
  }
`;

const TrackBackground = styled.div<{ fillPercent: number }>`
  height: 8px;
  background: linear-gradient(
    to right,
    #4CAF50 ${(props) => props.fillPercent}%,
    rgba(0, 0, 0, 0.1) ${(props) => props.fillPercent}%
  );
  border: 1px solid black;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  z-index: 1;
`;

const MarksContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  z-index: 0;
`;

const Mark = styled.div`
  text-align: center;
  font-size: 12px;
  color: #333;
  position: relative;
  width: 1px;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 10px;
    background-color: black;
    border-radius: 5px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transform: translate(-50%, -150%);
  pointer-events: none;
`;

function formatLabel(value: number): string {
  if (value >= 10000000) return `${value / 10000000}Cr`;
  if (value >= 100000) return `${value / 100000}L`;
  if (value >= 1000) return `${value / 1000}k`;
  return `${value}`;
}

function calculateMarks(maxValue: number): number[] {
  let factor = 5;

  if (maxValue <= 1000) factor = 200;
  else if (maxValue <= 10000) factor = 2000;
  else if (maxValue <= 100000) factor = 20000;
  else if (maxValue <= 1000000) factor = 200000;
  else if (maxValue <= 10000000) factor = 2000000;
  else if (maxValue <= 100000000) factor = 20000000;

  const marks = [];
  for (let i = factor; i <= maxValue; i += factor) {
    marks.push(i);
  }
  return marks;
}

const Slider: React.FC<SliderProps> = ({
  minValue = 0,
  maxValue,
  sliderSteps = 1,
  value,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState(value || minValue);
  const [showTooltip, setShowTooltip] = useState(false);
  const marks = calculateMarks(maxValue);
  const percent = ((currentValue - minValue) / (maxValue - minValue)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentValue(val);
    if (onChange) onChange(val);
  };

  return (
    <SliderContainer>
      <TrackBackground fillPercent={percent} />
      <StyledInput
        type="range"
        min={minValue}
        max={maxValue}
        step={sliderSteps}
        value={currentValue}
        onChange={handleChange}
        onMouseDown={() => setShowTooltip(true)}
        onMouseUp={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <Tooltip style={{ left: `${percent}%` }}>
          {currentValue}
        </Tooltip>
      )}
      <MarksContainer>
        {marks.map((val) => (
          <Mark key={val}>{formatLabel(val)}</Mark>
        ))}
      </MarksContainer>
    </SliderContainer>
  );
};

export default Slider;
