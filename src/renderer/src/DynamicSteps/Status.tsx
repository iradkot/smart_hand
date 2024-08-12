import { useState } from 'react';
import { Label } from '../../../components/ui/styledComponents';
import CopySections from '../CopySections';
import { useStore } from '../contexts/useStore';

const Status = () => {
  const stepState = useStore((state) => state.stepState);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const copiedContent = stepState.copiedContent;
  const [gptError] = useState(null);

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
