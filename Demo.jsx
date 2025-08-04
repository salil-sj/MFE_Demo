import React, { useMemo, useRef } from "react";
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

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const TrackWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Tooltip = styled.div<{ left: number }>`
  position: absolute;
  bottom: 25px;
  left: ${({ left }) => left}px;
  transform: translateX(-50%);
  background: #444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
`;

const StyledInput = styled.input<{ value: number; max: number }>`
  width: 100%;
  margin: 10px 0;
  appearance: none;
  height: 8px;
  border-radius: 10px;
  background: linear-gradient(
    to right,
    #6c7347 0%,
    #6c7347 ${({ value, max }) => (value / max) * 100}%,
    #ddd ${({ value, max }) => (value / max) * 100}%,
    #ddd 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    border: 3px solid #6c7347;
    border-radius: 50%;
    margin-top: -6px; /* Align center vertically */
    cursor: pointer;
    position: relative;
    z-index: 10;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border: 3px solid #6c7347;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 10px;
  }

  &::-moz-range-track {
    height: 8px;
    border-radius: 10px;
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
  const trackRef = useRef<HTMLDivElement>(null);

  // calculate position of tooltip
  const getTooltipLeft = () => {
    if (!trackRef.current) return 0;
    const trackWidth = trackRef.current.offsetWidth;
    const percentage = (value - minValue) / (maxValue - minValue);
    return percentage * trackWidth;
  };

  return (
    <SliderWrapper>
      {label && (
        <Label htmlFor={id}>
          {label} {value}
        </Label>
      )}
      <TrackWrapper ref={trackRef}>
        <Tooltip left={getTooltipLeft()}>{value}</Tooltip>
        <StyledInput
          type="range"
          id={id}
          min={minValue}
          max={maxValue}
          step={sliderSteps}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          value={value}
          max={maxValue}
        />
      </TrackWrapper>
      <Ruler>
        <span>0</span>
        {rulerSteps.map((val, i) => (
          <span key={i}>{formatRulerValue(val)}</span>
        ))}
      </Ruler>
    </SliderWrapper>
  );
};
