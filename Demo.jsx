import React, { useState } from "react";
import styled from "styled-components";

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ToggleButton = styled.button<{ isOn: boolean }>`
  position: relative;
  width: 80px;
  height: 36px;
  border: none;
  border-radius: 18px;
  background-color: ${({ isOn }) => (isOn ? "#4caf50" : "#ccc")};
  cursor: pointer;
  padding: 0;
  transition: background-color 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: ${({ isOn }) => (isOn ? "flex-end" : "center")};
`;

const ToggleKnob = styled.div<{ isOn: boolean }>`
  width: 28px;
  height: 28px;
  background-color: white;
  border-radius: 50%;
  margin: 4px;
  transition: all 0.3s ease;
`;

const Label = styled.span`
  position: absolute;
  left: 12px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
`;

type ToggleProps = {
  onToggle?: (isOn: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState); // callback
  };

  return (
    <ToggleWrapper>
      <ToggleButton isOn={isOn} onClick={handleClick}>
        {!isOn && <Label>Activate</Label>}
        <ToggleKnob isOn={isOn} />
      </ToggleButton>
    </ToggleWrapper>
  );
};

export default Toggle;
