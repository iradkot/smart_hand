import React, { useState } from 'react';
import { Label } from '../../../components/ui/styledComponents';
import CopySections from '../CopySections';
import { useCopyToClipboard } from '../contexts/CopyToClipboardContext';
import { useStepManager } from '../contexts/StepManagerContext';

const Status = () => {
  const { stepState } = useStepManager();


  const { isLoading, error, copiedContent } = useCopyToClipboard();
  const [gptError, setGptError] = useState(null);

  return (
    <>
      <Label>Step 3: Status</Label>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {gptError && <p>GPT Error: {gptError}</p>}
      {stepState.option === '3' && stepState.gptAnswer && !isLoading && !error && (
        <div>Ï
          <h2>GPT Answer</h2>
          <p>{stepState.gptAnswer}</p>
        </div>
      )}
      <CopySections content={copiedContent} />
    </>
  );
};

export default Status;
