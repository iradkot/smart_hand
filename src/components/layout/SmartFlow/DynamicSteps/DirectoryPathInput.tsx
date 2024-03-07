import React from 'react';
import { Label, Input } from '../../../ui/styledComponents';
import { StepState } from '../types';

const DirectoryPathInput = ({ stepState, setStepState }) => {
  const directoryPath = stepState.directoryPath || '';

  return (
    <>
      <Label>Step 1: Enter Directory Path</Label>
      <Input
        type="text"
        value={directoryPath}
        onChange={(e) => setStepState({ ...stepState, directoryPath: e.target.value })}
      />
    </>
  );
};

export default DirectoryPathInput;
