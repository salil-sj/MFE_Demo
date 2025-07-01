import React from 'react';
import styled from 'styled-components';

// --- Styled Container ---
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ccc; /* just for visual reference */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SliderWrapper = styled.div`
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StaggeringWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Label = styled.label`
  font-weight: 500;
`;

// --- Main Component ---
const PensionPayoutSection = () => {
  return (
    <Wrapper>
      <LabelWrapper>
        {/* Person Icon from internal library */}
        {/* <PersonIcon /> */}
        <Label>Payout amount pension</Label>
      </LabelWrapper>

      <AmountWrapper>
        {/* Currency Dropdown from internal library */}
        {/* <CurrencyDropdown defaultValue="USD" /> */}

        {/* Textbox from internal library */}
        {/* <TextBox placeholder="0" /> */}
      </AmountWrapper>

      <StaggeringWrapper>
        <Label>Staggering (share)</Label>
        {/* Decrement Button from internal library */}
        {/* <DecrementButton /> */}

        {/* Number Display from internal library */}
        {/* <DisplayNumber value={1} /> */}

        {/* Increment Button from internal library */}
        {/* <IncrementButton /> */}
      </StaggeringWrapper>

      <SliderWrapper>
        {/* Slider from internal library */}
        {/* <Slider min={0} max={80000} step={1000} /> */}
      </SliderWrapper>
    </Wrapper>
  );
};

export default PensionPayoutSection;
