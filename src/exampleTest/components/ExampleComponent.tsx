import React, { useState } from 'react';
import styled from 'styled-components'; // Import styled-components

interface ExampleComponentProps {
  initialCount?: number;
  isDisabled?: boolean;
}

// Styled component example for the container
const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
`;

const StyledButton = styled.button`
  margin: 5px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:disabled {
    background-color: grey;
  }
`;

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
                                                                    initialCount = 0,
                                                                    isDisabled = false,
                                                                  }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <Container>
      {/* Accessible name for better testing */}
      <label htmlFor="count">Counter</label>
      <p id="count" data-testid="count-display">Count: {count}</p>

      {/* Increment and decrement buttons */}
      <StyledButton
        onClick={() => setCount(count + 1)}
        data-testid="increment-button"
        disabled={isDisabled}
        type="button" // Set button type explicitly
      >
        Increment
      </StyledButton>
      <StyledButton
        onClick={() => setCount(count - 1)}
        data-testid="decrement-button"
        disabled={isDisabled}
        type="button" // Set button type explicitly
      >
        Decrement
      </StyledButton>
    </Container>
  );
};
