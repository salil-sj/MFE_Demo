// CustomSlider.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface CustomSliderProps {
  minValue?: number;
  maxValue?: number;
  step?: number;
  initialValue?: number;
}

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0;
`;

const StyledInput = styled.input.attrs({ type: "range" })<{
  value: number;
  min: number;
  max: number;
}>`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: transparent;
  position: relative;
  z-index: 3;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background: transparent;
    border: 1px solid black;
    border-radius: 4px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    border: 2px solid #007bff;
    background: white;
    cursor: pointer;
    margin-top: -8px; /* aligns thumb to center of track */
    position: relative;
    z-index: 5;
  }

  &::-moz-range-thumb {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    border: 2px solid #007bff;
    background: white;
    cursor: pointer;
  }

  &::-moz-range-track {
    height: 8px;
    background: transparent;
    border: 1px solid black;
    border-radius: 4px;
  }
`;

const FillTrack = styled.div<{ fillPercent: number }>`
  position: absolute;
  top: 50%;
  left: 0;
  height: 8px;
  width: ${({ fillPercent }) => fillPercent}%;
  background-color: green;
  border-radius: 4px;
  transform: translateY(-50%);
  z-index: 2;
`;

const Tooltip = styled.div<{ visible: boolean; value: number }>`
  position: absolute;
  top: -30px;
  left: ${({ value }) => value}%;
  transform: translateX(-50%);
  background: black;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  white-space: nowrap;
`;

const CustomSlider: React.FC<CustomSliderProps> = ({
  minValue = 0,
  maxValue = 100,
  step = 1,
  initialValue = 50,
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const handleMouseDown = () => setShowTooltip(true);
  const handleMouseUp = () => setShowTooltip(false);

  const fillPercent = ((value - minValue) / (maxValue - minValue)) * 100;

  return (
    <SliderWrapper>
      <Tooltip visible={showTooltip} value={fillPercent}>
        {value}
      </Tooltip>
      <FillTrack fillPercent={fillPercent} />
      <StyledInput
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      />
    </SliderWrapper>
  );
};

export default CustomSlider;
