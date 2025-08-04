import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface CustomSliderProps {
  minValue?: number;
  maxValue?: number;
  step?: number;
  rulerStep?: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  formatValue?: (val: number) => string;
  formatRulerLabel?: (val: number) => string;
  disabled?: boolean;
}

const SliderContainer = styled.div`
  width: 100%;
  padding: 40px 20px 20px;
  user-select: none;
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  transform: translateY(-50%);
`;

const SliderFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #2196f3;
  border-radius: 2px;
  transition: width 0.1s ease;
`;

const SliderThumb = styled.div`
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: #2196f3;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.1s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:active {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const RulerContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 30px;
`;

const RulerMark = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 8px;
  background: #666;
  transform: translateX(-50%);
`;

const RulerLabel = styled.div`
  position: absolute;
  top: 12px;
  font-size: 12px;
  color: #666;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const ValueDisplay = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #333;
  }
`;

const CustomSlider: React.FC<CustomSliderProps> = ({
  minValue = 0,
  maxValue = 1000000,
  step = 500,
  rulerStep = 100000,
  value: controlledValue,
  onChange,
  showValue = true,
  formatValue,
  formatRulerLabel,
  disabled = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<number>(controlledValue || minValue);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const defaultFormatValue = (val: number): string => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  const defaultFormatRulerLabel = (val: number): string => {
    if (val >= 1000000) return `${val / 1000000}M`;
    if (val >= 1000) return `${val / 1000}K`;
    return val.toString();
  };

  const valueFormatter = formatValue || defaultFormatValue;
  const rulerFormatter = formatRulerLabel || defaultFormatRulerLabel;

  const getPercentage = (val: number): number => ((val - minValue) / (maxValue - minValue)) * 100;

  const getValueFromPercentage = (percentage: number): number => {
    const rawValue = minValue + (percentage / 100) * (maxValue - minValue);
    return Math.round(rawValue / step) * step;
  };

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!sliderRef.current) return value;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return Math.max(minValue, Math.min(maxValue, getValueFromPercentage(percentage)));
  }, [minValue, maxValue, step, value]);

  const handleValueChange = useCallback((newValue: number) => {
    if (disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  }, [controlledValue, onChange, disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);
    const newValue = getValueFromPosition(e.clientX);
    handleValueChange(newValue);
  }, [disabled, getValueFromPosition, handleValueChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    e.preventDefault();
    const newValue = getValueFromPosition(e.clientX);
    handleValueChange(newValue);
  }, [isDragging, disabled, getValueFromPosition, handleValueChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const newValue = getValueFromPosition(touch.clientX);
    handleValueChange(newValue);
  }, [disabled, getValueFromPosition, handleValueChange]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || disabled) return;

    e.preventDefault();
    const touch = e.touches[0];
    const newValue = getValueFromPosition(touch.clientX);
    handleValueChange(newValue);
  }, [isDragging, disabled, getValueFromPosition, handleValueChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const rulerMarks = [];
  for (let val = minValue; val <= maxValue; val += rulerStep) {
    const percentage = getPercentage(val);
    rulerMarks.push({
      value: val,
      percentage,
      label: rulerFormatter(val)
    });
  }

  const currentPercentage = getPercentage(value);

  return (
    <SliderContainer {...props}>
      <SliderWrapper
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <SliderTrack>
          <SliderFill style={{ width: `${currentPercentage}%` }} />
        </SliderTrack>

        <SliderThumb
          style={{
            left: `${currentPercentage}%`,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
        >
          {showValue && (
            <ValueDisplay>
              {valueFormatter(value)}
            </ValueDisplay>
          )}
        </SliderThumb>

        <RulerContainer>
          {rulerMarks.map((mark, index) => (
            <React.Fragment key={index}>
              <RulerMark style={{ left: `${mark.percentage}%` }} />
              <RulerLabel style={{ left: `${mark.percentage}%` }}>
                {mark.label}
              </RulerLabel>
            </React.Fragment>
          ))}
        </RulerContainer>
      </SliderWrapper>
    </SliderContainer>
  );
};

const SliderDemo: React.FC = () => {
  const [value1, setValue1] = useState<number>(250000);
  const [value2, setValue2] = useState<number>(5000);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Custom Slider Component Demo</h2>

      <div style={{ marginBottom: '60px' }}>
        <h3>Large Value Slider (0 - 1M, step: 500)</h3>
        <p>Current value: {value1.toLocaleString()}</p>
        <CustomSlider
          minValue={0}
          maxValue={1000000}
          step={500}
          rulerStep={100000}
          value={value1}
          onChange={setValue1}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h3>Small Value Slider (0 - 10K, step: 100)</h3>
        <p>Current value: {value2.toLocaleString()}</p>
        <CustomSlider
          minValue={0}
          maxValue={10000}
          step={100}
          rulerStep={1000}
          value={value2}
          onChange={setValue2}
          formatValue={(val) => `$${val.toLocaleString()}`}
          formatRulerLabel={(val) => val >= 1000 ? `$${val / 1000}K` : `$${val}`}
        />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h3>Disabled Slider</h3>
        <CustomSlider
          minValue={0}
          maxValue={100000}
          step={1000}
          rulerStep={10000}
          value={50000}
          disabled
        />
      </div>
    </div>
  );
};

export default SliderDemo;
