import React from 'react';
import { Label, Input } from '../../style/styledComponents';

interface TextInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, placeholder, onChange }) => (
  <div>
    <Label>{placeholder}</Label>
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default TextInput;
