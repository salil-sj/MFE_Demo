const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const ToggleButton = styled.button<{ isOn: boolean }>`
  background-color: ${({ isOn }) => (isOn ? "#4caf50" : "#ccc")};
  border: none;
  border-radius: 20px;
  width: 60px;
  height: 30px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ToggleKnob = styled.div<{ isOn: boolean }>`
  background-color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${({ isOn }) => (isOn ? "33px" : "3px")};
  transition: left 0.3s ease;
`;

const Toggle = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <ToggleWrapper>
      <ToggleButton isOn={isOn} onClick={() => setIsOn(!isOn)}>
        <ToggleKnob isOn={isOn} />
      </ToggleButton>
    </ToggleWrapper>
  );
};

export default Toggle;
