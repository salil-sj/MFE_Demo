const FilledBar = styled.div<{ height: number; color: string }>`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  background-color: ${({ color }) => color};
  border-radius: 4px 4px 0 0;
`;

const EmptyBar = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  width: 100%;
`;
