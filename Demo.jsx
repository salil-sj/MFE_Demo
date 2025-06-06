import React from 'react';
import styled from 'styled-components';

// Replace with your internal library components if needed
const PersonIcon = () => <div style={{ fontSize: '16px', color: '#333' }}>👤</div>;

const PensionFundInputSection = () => {
  const [purchaseAmount, setPurchaseAmount] = React.useState('0');
  const [staggeringValue, setStaggeringValue] = React.useState(1);

  const handleAmountChange = (e) => {
    setPurchaseAmount(e.target.value);
  };

  const handleStaggeringDecrease = () => {
    if (staggeringValue > 1) {
      setStaggeringValue(staggeringValue - 1);
    }
  };

  const handleStaggeringIncrease = () => {
    setStaggeringValue(staggeringValue + 1);
  };

  return (
    <Container>
      <LeftSection>
        <IconContainer>
          <PersonIcon /> {/* 👈 internal Person icon */}
        </IconContainer>
        <PurchaseLabel>Purchase amount</PurchaseLabel>
      </LeftSection>

      <InputSection>
        <InputRow>
          <CurrencyLabel>CHF</CurrencyLabel>
          <InputWrapper>
            <StyledInput
              type="number"
              placeholder="0"
              value={purchaseAmount}
              onChange={handleAmountChange}
            />
            <DropdownArrow>▼</DropdownArrow>
          </InputWrapper>
        </InputRow>
        <SliderValue>0</SliderValue>
        <SliderLabel>Slider</SliderLabel>
      </InputSection>

      <StaggeringSection>
        <StaggeringLabel>Staggering (share)</StaggeringLabel>
        <StaggeringControls>
          <StaggeringButton onClick={handleStaggeringDecrease}>◀</StaggeringButton>
          <StaggeringValue>{staggeringValue}</StaggeringValue>
          <StaggeringButton onClick={handleStaggeringIncrease}>▶</StaggeringButton>
        </StaggeringControls>
      </StaggeringSection>
    </Container>
  );
};

export default PensionFundInputSection;
