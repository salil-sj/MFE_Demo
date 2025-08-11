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

// clamp function unchanged
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// styled-components unchanged
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

// Assume Slider component is imported here
// import Slider from "external-slider-lib";

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

  // NEW: Track dragging state internally
  const [isDragging, setIsDragging] = useState(false);

  // Update windowStart when value changes, as before
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

  // Handle input changes normally
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (!isNaN(newVal)) {
      onChange({ value: clamp(newVal, minValue, maxValue) });
    }
  };

  // NEW: Mouse event handlers to track dragging start and end
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Optionally commit final value if needed here
      onChange({ value });
    }
  };

  // NEW: Listen for mouseup on window AND window.parent (outside iframe)
  useEffect(() => {
    // On mouseup inside iframe window
    window.addEventListener("mouseup", handleMouseUp);

    // On mouseup outside iframe (on parent window)
    if (window.parent && window.parent !== window) {
      window.parent.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      if (window.parent && window.parent !== window) {
        window.parent.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isDragging, value]);

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
          onChange={(event) => {
            if (!isDragging) {
              // If not dragging, just update
              onChange(event);
            } else {
              // When dragging, still update value continuously
              onChange(event);
            }
          }}
          onMouseDown={handleMouseDown} // Capture mouse down on slider to start dragging
        />
      </SliderWrapper>
    </Container>
  );
};

export default WindowedSliderWrapper;
