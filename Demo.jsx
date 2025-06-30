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
  flex-wrap: wrap;
  justify-content: start;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Yellow = styled.div`
  background-color: yellow;
  width: 60px;
  height: 30px;

  @media (max-width: 768px) {
    width: 40%;
  }
`;

const Blue = styled.div`
  background-color: blue;
  width: 100px;
  height: 30px;

  @media (max-width: 768px) {
    width: 60%;
  }
`;

const Green = styled.div`
  background-color: green;
  width: 50px;
  height: 70px;
  margin-left: 10px;

  @media (max-width: 768px) {
    margin: 0 auto 10px auto;
  }
`;

const Red = styled.div`
  background-color: red;
  height: 30px;
  margin-top: 10px;
  width: 100%;
`;

const ResponsiveLayout = () => {
  return (
    <Container>
      <TopRow>
        <LeftGroup>
          <Yellow />
          <Blue />
        </LeftGroup>
        <Green />
      </TopRow>
      <Red />
    </Container>
  );
};

export default ResponsiveLayout;
