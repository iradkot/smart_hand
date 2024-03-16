import React, { useState } from 'react';
import { Label, Input, Button, RadioGroup, Radio, Form } from '../../../components/ui/styledComponents';
import { useStepManager } from '../contexts/StepManagerContext';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '../contexts/CopyToClipboardContext';
import { optionsData } from './OPTION_SHOW_REACT_NATIVE_LOGS';
import { OptionValue } from '../types'; // Assuming this is the correct import path for your types

const CopyConfigurationForm = () => {
  const { stepState, setStepState } = useStepManager();
  const { copyToClipboard } = useCopyToClipboard();
  const navigate = useNavigate();
  const [directoryPath, setDirectoryPath] = useState(stepState.directoryPath);
  const [option, setOption] = useState<OptionValue>(stepState.option || '1'); // Default to '1' if not set

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Use the updated setStepState with a callback
    setStepState({ ...stepState, directoryPath, option }, () => {
      console.log('State updated:', { directoryPath, option });
      // Perform actions after the state update
      copyToClipboard(directoryPath).then(() => {
        navigate('/status');
      });
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RadioGroup>
        {optionsData.map((opt) => (
          <Label key={opt.value}>
            <Radio
              type="radio"
              name="option"
              value={opt.value}
              checked={option === opt.value}
              onChange={(e) => setOption(e.target.value as OptionValue)}
            />
            {opt.label}
          </Label>
        ))}
      </RadioGroup>

      <Label>Enter Directory Path</Label>
      <Input
        type="text"
        placeholder="e.g., /path/to/directory"
        value={directoryPath}
        onChange={(e) => setDirectoryPath(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CopyConfigurationForm;
