import React, { useState } from 'react';
import { Button, Form } from '../../../../components/ui/styledComponents';
import { useNavigate } from 'react-router-dom';
import { optionsData } from '../OPTION_SHOW_REACT_NATIVE_LOGS';
import RadioGroup from './RadioGroup';
import TextInput from './TextInput';
import { useFormHandler } from './useFormHandler';
import { useCopyToClipboard } from '../../contexts';

const CopyConfigurationForm: React.FC = () => {
  const navigate = useNavigate();
  const { copyToClipboard } = useCopyToClipboard();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    directoryPath,
    option,
    setDirectoryPath,
    setOption,
    updateState,
  } = useFormHandler('C:\\Users\\irad1\\projects\\smart_hand', '1');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        // Phase 1: Update state
        await updateState();

        // Phase 2: Execute side effects
        await copyToClipboard(directoryPath);
        navigate('/status');
      } catch (error) {
        console.error('Failed to process submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RadioGroup
        options={optionsData}
        selectedOption={option}
        onChange={setOption}
      />
      <TextInput
        value={directoryPath}
        placeholder="Enter Directory Path"
        onChange={setDirectoryPath}
      />
      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </Form>
  );
};

export default CopyConfigurationForm;
