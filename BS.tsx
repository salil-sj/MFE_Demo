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

  // UI props
  isLogo?: boolean;
  logoSrc?: string;
  label: string;
  inputLabel: string;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const WindowedSliderWrapper: React.FC<WindowedSliderWrapperProps> = ({
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
  const effectiveStep = stepSize ?? Math.floor(windowSize / 2);
  const [windowStart, setWindowStart] = useState(minValue);
  const prevValueRef = useRef(value);

  // Direction-aware shifting
  useEffect(() => {
    const prevValue = prevValueRef.current;
    const direction =
      value > prevValue ? "forward" : value < prevValue ? "backward" : null;

    if (
      direction === "forward" &&
      value > windowStart + windowSize &&
      windowStart + windowSize < maxValue
    ) {
      setWindowStart((prev) =>
        Math.min(prev + effectiveStep, maxValue - windowSize)
      );
    } else if (
      direction === "backward" &&
      value < windowStart &&
      windowStart > minValue
    ) {
      setWindowStart((prev) => Math.max(prev - effectiveStep, minValue));
    }

    prevValueRef.current = value;
  }, [value, windowStart, effectiveStep, minValue, maxValue, windowSize]);

  const windowEnd = Math.min(windowStart + windowSize, maxValue);
  const sliderValue = clamp(value, windowStart, windowEnd);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (!isNaN(newVal)) {
      onChange({ value: clamp(newVal, minValue, maxValue) });
    }
  };

  return (
    <Wrapper>
      <TopBar>
        <LeftSection>
          {isLogo && (
            <LogoBox>
              {logoSrc ? (
                <img src={logoSrc} alt="logo" />
              ) : (
                <span>Logo</span>
              )}
            </LogoBox>
          )}
          <Label>{label}</Label>
        </LeftSection>

        <RightSection>
          <span>{inputLabel}</span>
          <NumberInput
            type="number"
            value={sliderValue}
            onChange={handleInputChange}
          />
        </RightSection>
      </TopBar>

      <Slider
        id={`${id}-window`}
        minValue={windowStart}
        maxValue={windowEnd}
        sliderSteps={sliderSteps}
        rulerSteps={rulerSteps}
        value={sliderValue}
        onChange={onChange}
      />
    </Wrapper>
  );
};

/* ===== Styled Components ===== */
const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 8px;
  gap: 10px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    font-size: 0.9rem;
  }
`;

const NumberInput = styled.input`
  width: 100px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export default WindowedSliderWrapper;
