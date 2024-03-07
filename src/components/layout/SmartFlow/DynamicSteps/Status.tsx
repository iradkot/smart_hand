import React, { useState } from 'react';
import { Label } from '../../../ui/styledComponents';
import CopySections from '../CopySections';
import { useCopyToClipboard } from '../../../../renderer/src/contexts/CopyToClipboardContext';

const Status = ({ stepState }) => {
  const { isLoading, error, copiedContent } = useCopyToClipboard();
  const [gptError, setGptError] = useState(null);

  return (
    <>
      <Label>Step 3: Status</Label>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {gptError && <p>GPT Error: {gptError}</p>}
      {stepState.option === '3' && stepState.gptAnswer && !isLoading && !error && (
        <div>
          <h2>GPT Answer</h2>
          <p>{stepState.gptAnswer}</p>
        </div>
      )}
      <CopySections content={copiedContent} />
    </>
  );
};

export default Status;
