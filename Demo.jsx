import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { calculateBarHeights } from './barChartUtils'; // <-- Your function here

interface BarChartProps {
  taxSavingsSinglePurchase: number;
  improvementWithStaggering: number;
  taxSavingsOfStaggeredPurchase: number;
}

const ChartWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 300px; // max height
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

const BarContainer = styled.div`
  flex: 1;
  margin: 0 8px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
`;

const FilledBar = styled.div<{ height: number; color: string }>`
  height: ${({ height }) => height}%;
  width: 100%;
  background-color: ${({ color }) => color};
  border-radius: 4px 4px 0 0;
`;

const EmptyBar = styled.div<{ height: number }>`
  height: ${({ height }) => height}%;
  width: 100%;
`;

const Label = styled.div`
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
`;

const BarChart: React.FC<BarChartProps> = ({
  taxSavingsSinglePurchase,
  improvementWithStaggering,
  taxSavingsOfStaggeredPurchase
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [widgetWidth, setWidgetWidth] = useState<number>(800);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidgetWidth(entry.contentRect.width);
      }
    });

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const barData = calculateBarHeights({
    taxSavingsSinglePurchase,
    improvementWithStaggering,
    taxSavingsOfStaggeredPurchase,
    widgetWidth
  });

  const bars = [barData.singlePurchase, barData.improvement, barData.staggeredPurchase];

  return (
    <ChartWrapper ref={wrapperRef}>
      {bars.map((bar, index) => (
        <BarContainer key={index}>
          <FilledBar height={bar.height} color={getColor(bar.color)} />
          <EmptyBar height={bar.emptyHeight} />
          <Label>{bar.label}</Label>
        </BarContainer>
      ))}
    </ChartWrapper>
  );
};

// Map legacy color names to actual hex codes
function getColor(name: string): string {
  switch (name) {
    case 'fern': return '#4F7942';
    case 'stone': return '#787276';
    case 'olive': return '#708238';
    case 'smoke': return '#999999';
    default: return '#cccccc';
  }
}

export default BarChart;
