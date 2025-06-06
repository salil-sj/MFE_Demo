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




const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 12px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const PurchaseLabel = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 400;
  white-space: nowrap;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CurrencyLabel = styled.span`
  font-size: 13px;
  color: #333;
  min-width: 25px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 60px;
  height: 20px;
  padding: 2px 18px 2px 4px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 13px;
  background-color: white;
  text-align: right;
`;

const DropdownArrow = styled.span`
  position: absolute;
  right: 4px;
  font-size: 10px;
  color: #666;
  pointer-events: none;
`;

const SliderValue = styled.div`
  font-size: 11px;
  color: #999;
  text-align: center;
`;

const SliderLabel = styled.div`
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 4px;
`;

const StaggeringSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StaggeringLabel = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 400;
  white-space: nowrap;
`;

const StaggeringControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StaggeringButton = styled.button`
  width: 18px;
  height: 18px;
  border: 1px solid #999;
  background: white;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  color: #333;

  &:hover {
    background: #f0f0f0;
    border-color: #666;
  }
`;

const StaggeringValue = styled.span`
  font-size: 13px;
  color: #333;
  min-width: 15px;
  text-align: center;
  margin: 0 2px;
`;

