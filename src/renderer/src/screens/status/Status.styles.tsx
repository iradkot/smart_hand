import styled from 'styled-components';

// Base styles
export const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadow.default};
`;

export const Section = styled.div`
  margin-bottom: 30px;
`;
