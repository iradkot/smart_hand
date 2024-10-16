// src/style/styledComponents.ts

import styled from 'styled-components';

export const Label = styled.label`
  margin-bottom: 10px;
  display: block;
  font-weight: bold;
  color: ${({ theme }) => theme.textColor};
`;

export const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
