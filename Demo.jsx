// Dashboard.js
import React from 'react';
import styled from 'styled-components';

const data = [
  { title: 'Users', count: 128 },
  { title: 'Orders', count: 57 },
  { title: 'Revenue', count: '$3,200' },
  { title: 'Feedbacks', count: 24 },
];

const Dashboard = () => {
  return (
    <Container>
      {data.map((item, index) => (
        <Card key={index}>
          <Title>{item.title}</Title>
          <Count>{item.count}</Count>
        </Card>
      ))}
    </Container>
  );
};

export default Dashboard;



// You can define these in the same file or extract to styles.js

import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  background-color: #f9f9f9;
  padding: 25px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const Count = styled.p`
  margin: 10px 0 0;
  font-size: 1.6rem;
  font-weight: bold;
  color: #007bff;
`;
