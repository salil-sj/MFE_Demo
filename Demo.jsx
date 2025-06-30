// App.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border: 2px solid black;
  padding: 10px;
  max-width: 90%;
  margin: auto;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
  }
`;

const LeftBoxes = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 5px;
  }
`;

const Yellow = styled.div`
  background-color: yellow;
  width: 80px;
  height: 40px;
`;

const Blue = styled.div`
  background-color: blue;
  width: 120px;
  height: 40px;
`;

const Green = styled.div`
  background-color: green;
  width: 50px;
  height: 60px;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const Red = styled.div`
  background-color: red;
  margin-top: 10px;
  height: 40px;

  /* Take width equal to Yellow + Blue + gap (desktop) */
  width: calc(80px + 120px + 10px);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResponsiveLayout = () => {
  return (
    <Container>
      <TopRow>
        <LeftBoxes>
          <Yellow />
          <Blue />
        </LeftBoxes>
        <Green />
      </TopRow>
      <Red />
    </Container>
  );
};

export default ResponsiveLayout;
