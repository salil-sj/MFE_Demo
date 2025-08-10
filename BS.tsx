import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface WindowedSliderWrapperProps {
  id: string;
  minValue: number;
  maxValue: number;
  windowSize: number;
  stepSize?: number;
  sliderSteps: number;
  rulerSteps: number;
  value: number;
  onChange: (event: { value: number }) => void;
  isLogo?: boolean;
  logoSrc?: string;
  label?: string;
  inputLabel?: string;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Logo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const Label = styled.span`
  font-weight: bold;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InputLabel = styled.span``;

const ValueInput = styled.input`
  width: 80px;
  padding: 4px;
  text-align: right;
`;

const SliderWrapper = styled.div`
  width: 100%;
`;

const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
  id,
  minValue,
  maxValue,
  windowSize,
  stepSize,
  sliderSteps,
  rulerSteps,
  value,
  onChange,
  isLogo = false,
  logoSrc,
  label,
  inputLabel,
}) => {
  const effectiveStep = Math.max(1, Math.floor(stepSize ?? Math.floor(windowSize / 2)));
  const [windowStart, setWindowStart] = useState<number>(minValue);
  const prevValueRef = useRef<number>(value);

  // Preserve your original perfect logic
  useEffect(() => {
    const prev = prevValueRef.current;
    if (value === prev) return;

    const movingForward = value > prev;
    let ws = windowStart;

    if (movingForward) {
      while (value >= ws + windowSize && ws + effectiveStep <= maxValue - windowSize) {
        ws = Math.min(ws + effectiveStep, maxValue - windowSize);
      }
    } else {
      while (value <= ws && ws - effectiveStep >= minValue) {
        ws = Math.max(ws - effectiveStep, minValue);
      }
    }

    if (ws !== windowStart) {
      setWindowStart(ws);
    }

    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  const sliderValue = clamp(value, windowStart, windowEnd);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (!isNaN(newVal)) {
      onChange({ value: clamp(newVal, minValue, maxValue) });
    }
  };

  return (
    <Container>
      <TopRow>
        <LeftSection>
          {isLogo && logoSrc && <Logo src={logoSrc} alt="Logo" />}
          {label && <Label>{label}</Label>}
        </LeftSection>
        <InputContainer>
          {inputLabel && <InputLabel>{inputLabel}</InputLabel>}
          <ValueInput type="number" value={value} onChange={handleInputChange} />
        </InputContainer>
      </TopRow>

      <SliderWrapper>
        <Slider
          id={`${id}-window`}
          minValue={windowStart}
          maxValue={windowEnd}
          sliderSteps={sliderSteps}
          rulerSteps={rulerSteps}
          value={sliderValue}
          onChange={onChange}
        />
      </SliderWrapper>
    </Container>
  );
};

export default WindowedSliderWrapper;
