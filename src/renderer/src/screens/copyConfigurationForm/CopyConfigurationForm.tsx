import React, { useState } from 'react';
import { Button, Form } from '../../../../components/ui/styledComponents';
import { optionsData, OPTION_COPY_FILE_CONTENTS } from '../OPTION_SHOW_REACT_NATIVE_LOGS';
import RadioGroup from './RadioGroup';
import TextInput from './TextInput';
import { useStore } from '../../stateManagement/zustand/useStore';
import { OptionValue } from '../../types';
import {useAppNavigation} from "../../hooks/useAppNavigation";

const CopyConfigurationForm: React.FC = () => {
  const copyToClipboard = useStore((state) => state.copyToClipboard);
  const setStepState = useStore((state) => state.setStepState);
  const stepState = useStore((state) => state.stepState);
  const navigateTo = useAppNavigation();
  const directoryPath = stepState.directoryPath;
  const option: OptionValue = stepState.option || OPTION_COPY_FILE_CONTENTS;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        setStepState({
          ...stepState,
          directoryPath,
          option,
        });
        await copyToClipboard(directoryPath, option);
        navigateTo('/status'); // Update the route in the store
      } catch (error) {
        console.error('Failed to process submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  const handleOptionChange = (newOption: OptionValue) => {
    setStepState({
      ...stepState,
      option: newOption,
    });
  };

  const handleDirectoryPathChange = (newPath: string) => {
    setStepState({
      ...stepState,
      directoryPath: newPath,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RadioGroup
        options={optionsData}
        selectedOption={option}
        onChange={handleOptionChange}
      />
      <TextInput
        value={directoryPath}
        placeholder="Enter Directory Path"
        onChange={handleDirectoryPathChange}
      />
      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </Form>
  );
};

export default CopyConfigurationForm;
