import React from 'react';
import styled from 'styled-components';
import { Slider } from 'your-internal-lib';
import { FaLock } from 'react-icons/fa'; // or any lock icon

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

const StyledSlider = styled(Slider)<{ disabled?: boolean }>`
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #555;
  font-size: 1.2rem;
`;

const LockBox = styled.div`
  position: relative;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
`;

const ActivateButton = styled.button`
  margin-left: auto;
  padding: 0.3rem 0.6rem;
  background: #888;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  cursor: not-allowed;
`;

export const PensionSlider = ({ locked }: { locked: boolean }) => {
  return (
    <LockBox>
      <SliderWrapper>
        {locked && (
          <LockOverlay>
            <FaLock />
          </LockOverlay>
        )}
        <StyledSlider disabled={locked} />
      </SliderWrapper>
      {locked && <ActivateButton disabled>Activate</ActivateButton>}
    </LockBox>
  );
};
