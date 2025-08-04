""import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface RulerStep {
  value: number;
  label: string;
}

interface CustomSliderProps {
  id?: string;
  label?: string;
  values?: number[];
  minValue?: number;
  maxValue?: number;
  rulerSteps?: number;
  sliderStep?: number;
}

const Wrapper = styled.div`
  margin: 1rem 0;
`;

const SliderContainer = styled.div`
  position: relative;
`;

const StyledSlider = styled.input`
  width: 100%;
`;

const Ruler = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  top: 20px;
`;

const RulerStepLabel = styled.span`
  font-size: 12px;
  white-space: nowrap;
`;

const ValueLabel = styled.div`
  margin-top: 0.5rem;
  text-align: center;
  font-weight: bold;
`;

const formatLabel = (value: number): string => {
  if (value >= 1_00_00_000) return `${value / 1_00_00_000}cr`;
  if (value >= 1_00_000) return `${value / 1_00_000}L`;
  if (value >= 1000) return `${value / 1000}k`;
  return `${value}`;
};

const generateRulerSteps = (min: number, max: number, count: number): RulerStep[] => {
  if (count <= 1) return [{ value: max, label: formatLabel(max) }];

  const stepSize = (max - min) / (count - 1);
  const steps: RulerStep[] = [];

  for (let i = 0; i < count; i++) {
    const val = Math.round(min + stepSize * i);
    steps.push({ value: val, label: formatLabel(val) });
  }

  return steps;
};

const CustomSlider: React.FC<CustomSliderProps> = ({
  id,
  label,
  values = [],
  minValue = 0,
  maxValue = 100,
  rulerSteps = 5,
  sliderStep = 1,
}) => {
  const [value, setValue] = useState<number>(values[0] ?? minValue);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (values.length > 0) {
      setValue(values[0]);
    }
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
  };

  const ruler = generateRulerSteps(minValue, maxValue, rulerSteps);

  return (
    <Wrapper id={id}>
      {label && <label htmlFor={id}>{label}</label>}
      <SliderContainer>
        <StyledSlider
          ref={sliderRef}
          type="range"
          id={id}
          min={minValue}
          max={maxValue}
          step={sliderStep}
          value={value}
          onChange={handleChange}
        />
        <Ruler>
          {ruler.map((step, index) => (
            <RulerStepLabel key={index}>{step.label}</RulerStepLabel>
          ))}
        </Ruler>
      </SliderContainer>
      <ValueLabel>{value}</ValueLabel>
    </Wrapper>
  );
};

export default CustomSlider;
