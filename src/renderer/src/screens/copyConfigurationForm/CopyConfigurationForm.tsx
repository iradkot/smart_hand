// src/screens/copyConfigurationForm/CopyConfigurationForm.tsx

import React, { useState } from 'react';
import { Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { optionsData, OPTION_COPY_FILE_CONTENTS } from '../OPTION_SHOW_REACT_NATIVE_LOGS';
import { useStore } from '../../stateManagement/zustand/useStore';
import { OptionValue } from '../../types/types';
import { useAppNavigation } from '../../hooks/useAppNavigation';

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
        navigateTo('/status');
      } catch (error) {
        console.error('Failed to process submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStepState({
      ...stepState,
      option: event.target.value as OptionValue,
    });
  };

  const handleDirectoryPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStepState({
      ...stepState,
      directoryPath: event.target.value,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Option</FormLabel>
        <RadioGroup row value={option} onChange={handleOptionChange}>
          {optionsData.map((opt) => (
            <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
          ))}
        </RadioGroup>
      </FormControl>
      <TextField
        fullWidth
        label="Directory Path"
        variant="outlined"
        value={directoryPath}
        onChange={handleDirectoryPathChange}
      />
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        Submit
      </Button>
    </Box>
  );
};

export default CopyConfigurationForm;
