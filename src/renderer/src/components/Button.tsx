import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const sizeStyles = {
  small: 'padding: 6px 12px; font-size: 0.875rem;',
  medium: 'padding: 10px 20px; font-size: 1rem;',
  large: 'padding: 14px 28px; font-size: 1.125rem;',
};

const variantStyles = {
  primary: css`
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  `,
  secondary: css`
    background-color: #6c757d;
    color: white;

    &:hover {
      background-color: #5a6268;
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  ${({ size = 'medium' }) => sizeStyles[size]}
  ${({ variant = 'primary' }) => variantStyles[variant]}

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #0056b3;
    outline-offset: 2px;
  }
`;
