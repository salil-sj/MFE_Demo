import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  border: 1px solid #ccc; /* Optional visual aid */
`;

const TopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;

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
`;

const StaggeringWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SliderWrapper = styled.div`
  width: 100%; /* Ensures it always spans full width */
`;

const Label = styled.label`
  font-weight: 500;
`;

const PensionPayoutSection = () => {
  return (
    <Wrapper>
      <TopRow>
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
          {/* <DecrementButton /> */}
          {/* <DisplayNumber value={1} /> */}
          {/* <IncrementButton /> */}
        </StaggeringWrapper>
      </TopRow>

      <SliderWrapper>
        {/* Slider from internal library */}
        {/* <Slider min={0} max={80000} step={1000} /> */}
      </SliderWrapper>
    </Wrapper>
  );
};

export default PensionPayoutSection;
