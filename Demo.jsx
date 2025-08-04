import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface CustomSliderProps {
  minValue: number;
  maxValue: number;
  sliderSteps: number;
  value: number;
  onChange: (val: number) => void;
}

const SliderContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  position: relative;
`;

const StyledSlider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right, #90ee90 0%, #90ee90 var(--progress), #eee var(--progress), #eee 100%);
  outline: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 4px solid black;
    cursor: pointer;
    z-index: 3;
    position: relative;
  }
`;

const Tooltip = styled.div<{ left: number }>`
  position: absolute;
  top: -2rem;
  left: ${(props) => props.left}px;
  transform: translateX(-50%);
  background: #000;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const MarksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: bold;
  color: black;
`;

const Mark = styled.div`
  text-align: center;
  width: 20px;
`;

const formatLabel = (value: number): string => {
  if (value >= 10000000) return `${value / 10000000}Cr`;
  if (value >= 100000) return `${value / 100000}L`; // Lakh
  if (value >= 1000) return `${value / 1000}k`;
  return value.toString();
};

const generateMarks = (maxValue: number): number[] => {
  const step = maxValue / 5;
  return [1, 2, 3, 4].map((i) => Math.round(i * step));
};

const CustomSlider: React.FC<CustomSliderProps> = ({ minValue, maxValue, sliderSteps, value, onChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState(0);
  const rangeRef = useRef<HTMLInputElement>(null);
  const marks = generateMarks(maxValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange(val);
    updateTooltipPosition();
  };

  const updateTooltipPosition = () => {
    const range = rangeRef.current;
    if (range) {
      const percent = (value - minValue) / (maxValue - minValue);
      const width = range.offsetWidth;
      setTooltipPos(percent * width);
    }
  };

  useEffect(() => {
    updateTooltipPosition();
  }, [value]);

  return (
    <SliderContainer>
      <StyledSlider
        ref={rangeRef}
        type="range"
        min={minValue}
        max={maxValue}
        step={sliderSteps}
        value={value}
        onChange={handleInputChange}
        onMouseDown={() => setShowTooltip(true)}
        onMouseUp={() => setShowTooltip(false)}
        style={{
          '--progress': `${((value - minValue) / (maxValue - minValue)) * 100}%`
        } as React.CSSProperties}
      />
      {showTooltip && <Tooltip left={tooltipPos}>{value}</Tooltip>}
      <MarksContainer>
        {marks.map((mark, index) => (
          <Mark key={index}>{formatLabel(mark)}</Mark>
        ))}
      </MarksContainer>
    </SliderContainer>
  );
};

export default CustomSlider;
