import styled from 'styled-components';

export const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

export const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;


export const StyledButton = styled.button`
  background-color: ${props => props.theme.buttonBackgroundColor};
  color: ${props => props.theme.buttonTextColor};
  padding: 10px 15px;
  border-radius: ${props => props.theme.borderRadius}px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: ${props => props.theme.accentColor};
  }
`;

