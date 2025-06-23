import React, { useState } from 'react';
import styled from 'styled-components';
import { Slider } from 'your-internal-lib'; // keep your actual import
import { FaLock } from 'react-icons/fa';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  background-color: #f7f7f7;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const LockIcon = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  color: #666;
  z-index: 2;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.6);
  pointer-events: none;
  border-radius: 4px;
  z-index: 1;
`;

const StyledSliderWrapper = styled.div`
  flex: 1;
  padding-left: 30px;
  position: relative;
  z-index: 0;
`;

const ActivateButton = styled.button`
  align-self: flex-start;
  padding: 0.3rem 0.7rem;
  background-color: #bbb;
  color: white;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: not-allowed;
`;

const UnlockButton = styled.button`
  align-self: flex-start;
  padding: 0.3rem 0.7rem;
  background-color: #4caf50;
  color: white;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PensionSliderBox = () => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <Container>
      <SliderWrapper>
        {isLocked && (
          <>
            <LockIcon>
              <FaLock />
            </LockIcon>
            <Overlay />
          </>
        )}
        <StyledSliderWrapper>
          <Slider /> {/* your internal slider - no change */}
        </StyledSliderWrapper>
      </SliderWrapper>

      {isLocked ? (
        <ActivateButton disabled>Activate</ActivateButton>
      ) : (
        <UnlockButton onClick={() => setIsLocked(true)}>Lock</UnlockButton>
      )}

      {!isLocked && (
        <small style={{ color: '#888' }}>
          * Slider is now editable
        </small>
      )}

      {isLocked && (
        <UnlockButton onClick={() => setIsLocked(false)}>Unlock</UnlockButton>
      )}
    </Container>
  );
};

export default PensionSliderBox;
