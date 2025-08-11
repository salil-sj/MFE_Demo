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
  inputLabel?: string; // e.g. "USD"
  showInfoIcon?: boolean;
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
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoIcon = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 2px;
  overflow: hidden;
`;

const InputLabel = styled.span`
  background-color: #f8f8f8;
  padding: 4px 6px;
  font-size: 13px;
  color: #555;
  border-right: 1px solid #ccc;
`;

const ValueInput = styled.input`
  width: 80px;
  padding: 4px;
  text-align: right;
  border: none;
  font-size: 13px;

  &:focus {
    outline: none;
  }
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
  showInfoIcon = false,
}) => {
  const effectiveStep = Math.max(1, Math.floor(stepSize ?? Math.floor(windowSize / 2)));
  const [windowStart, setWindowStart] = useState<number>(minValue);
  const prevValueRef = useRef<number>(value);
  const windowUpdateTimeoutRef = useRef<NodeJS.Timeout>();

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
      // Clear any previous timeout
      if (windowUpdateTimeoutRef.current) {
        clearTimeout(windowUpdateTimeoutRef.current);
      }
      
      // Add delay for window changes to handle iframe mouse event issues
      windowUpdateTimeoutRef.current = setTimeout(() => {
        setWindowStart(ws);
      }, 300);
    }

    prevValueRef.current = value;
  }, [value, windowStart, windowSize, effectiveStep, minValue, maxValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (windowUpdateTimeoutRef.current) {
        clearTimeout(windowUpdateTimeoutRef.current);
      }
    };
  }, []);

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
          {showInfoIcon && <InfoIcon>i</InfoIcon>}
          <InputWrapper>
            {inputLabel && <InputLabel>{inputLabel}</InputLabel>}
            <ValueInput type="number" value={value} onChange={handleInputChange} />
          </InputWrapper>
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
