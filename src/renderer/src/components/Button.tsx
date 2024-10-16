// src/components/Button.tsx

import React from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';

interface ButtonProps extends MUIButtonProps {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return (
    <MUIButton
      color={variant === 'primary' ? 'primary' : 'secondary'}
      {...props}
    />
  );
};

export default Button;
