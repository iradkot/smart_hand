import React, { useState } from 'react';
import { Label, Input } from '../../../components/ui/styledComponents';
import { useStepManager } from '../contexts/StepManagerContext';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '../contexts/CopyToClipboardContext';

const DirectoryPathInput = () => {
  const { stepState, setStepState } = useStepManager();
  const { copyToClipboard } = useCopyToClipboard();
  const navigate = useNavigate();
  const [directoryPath, setDirectoryPath] = useState(stepState.directoryPath);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStepState({ ...stepState, directoryPath });
    copyToClipboard(directoryPath); // Add this line
    // navigate('/status');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Step 1: Enter Directory Path</Label>
      <Input
        type="text"
        value={directoryPath}
        onChange={(e) => setDirectoryPath(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default DirectoryPathInput;
