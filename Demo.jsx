const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  max-width: 800px; /* adjust to match your design width */
  margin: 0 auto; /* center the component on the screen */
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
  width: 100%;

  @media (min-width: 769px) {
    max-width: 800px; /* match Wrapper */
  }

  @media (max-width: 768px) {
    width: 100%; /* full width on mobile */
  }
`;

const Label = styled.label`
  font-weight: 500;
`;
