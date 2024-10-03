import React from 'react';
import { Label, Radio } from '../../../../components/ui/styledComponents';
import { OptionValue } from '../../types/types';

interface Option {
  value: OptionValue;
  label: string;
}

interface RadioGroupProps {
  options: Option[];
  selectedOption: OptionValue;
  onChange: (value: OptionValue) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedOption, onChange }) => (
  <div>
    {options.map((opt) => (
      <Label key={opt.value}>
        <Radio
          type="radio"
          name="option"
          value={opt.value}
          checked={selectedOption === opt.value}
          onChange={(e) => onChange(e.target.value as OptionValue)} // Cast to OptionValue here
        />
        {opt.label}
      </Label>
    ))}
  </div>
);

export default RadioGroup;
