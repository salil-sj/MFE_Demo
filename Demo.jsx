// CustomSlider.tsx

import React, { useMemo } from "react";
import styled from "styled-components";

interface SliderProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  minValue: number;
  maxValue: number;
  sliderSteps: number;
}

const SliderWrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  margin: 10px 0;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #ddd;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: white;
    border: 3px solid #6c7347;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: white;
    border: 3px solid #6c7347;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    background: linear-gradient(
      to right,
      #6c7347 0%,
      #6c7347 ${({ value, max }) => (value / max) * 100}%,
      #ddd ${({ value, max }) => (value / max) * 100}%,
      #ddd 100%
    );
  }
`;

const Ruler = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #444;
  overflow: hidden;
`;

function formatRulerValue(value: number): string {
  if (value >= 10000000) return `${value / 10000000}Cr`;
  if (value >= 100000) return `${value / 100000}L`;
  if (value >= 1000) return `${value / 1000}k`;
  return `${value}`;
}

function generateRulerSteps(maxValue: number): number[] {
  const stepCount = 5;
  const step = Math.ceil(maxValue / stepCount);
  const roundedStep = Math.pow(10, Math.floor(Math.log10(step)));
  const finalStep = Math.ceil(step / roundedStep) * roundedStep;
  return Array.from({ length: stepCount }, (_, i) => finalStep * (i + 1));
}

export const CustomSlider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  onChange,
  minValue,
  maxValue,
  sliderSteps,
}) => {
  const rulerSteps = useMemo(() => generateRulerSteps(maxValue), [maxValue]);

  return (
    <SliderWrapper>
      {label && (
        <label htmlFor={id}>
          <strong>{label}</strong> {value}
        </label>
      )}
      <StyledInput
        type="range"
        id={id}
        min={minValue}
        max={maxValue}
        step={sliderSteps}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <Ruler>
        <span>0</span>
        {rulerSteps.map((val, i) => (
          <span key={i}>{formatRulerValue(val)}</span>
        ))}
      </Ruler>
    </SliderWrapper>
  );
};
