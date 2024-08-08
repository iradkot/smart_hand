import styled from 'styled-components';

export const Label = styled.label`
  margin-bottom: 10px;
  display: block; // Ensure label takes its own line for better readability
  font-weight: bold;
`;

export const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
  display: block; // Input elements take the full width
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block; // Let the button take its own line
  width: 100%; // Full-width button for better mobile responsiveness
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const RadioGroup = styled.div`
  margin-bottom: 20px;
`;

export const RadioLabel = styled.label`
  margin-right: 20px; // Space out the radio buttons
  font-weight: normal;
`;

export const Radio = styled.input`
  margin-right: 10px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px; // Provide some space between form elements
`;

export const StyledButton = styled(Button)`
  margin-top: 20px;
`;
