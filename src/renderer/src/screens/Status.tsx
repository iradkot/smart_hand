import { useState } from 'react';
import { Label } from '../../../components/ui/styledComponents';
import CopySections from '../components/CopySections';
import { useStore } from '../contexts/useStore';
import { StepState } from '../types';

const Status = () => {
  const stepState = useStore((state) => state.stepState) as StepState; // Explicitly cast to StepState
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const copiedContent = stepState?.copiedContent;
  const [gptError] = useState<string | null>(null);

  const joinedContent = Array.isArray(copiedContent?.fileContents)
    ? copiedContent.fileContents
      .filter(item => item.isFile && item.content) // Filter files with content
      .map(item => item.content) // Extract the content key
      .join('\n') // Join all content with a newline
    : ''; // Provide a fallback if `copiedContent` is undefined or `fileContents` is not an array

  return (
    <>
      <Label>Step 3: Status</Label>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {gptError && <p>GPT Error: {gptError}</p>}
      {stepState?.option === '3' && stepState?.gptAnswer && !isLoading && !error && (
        <div>
          <h2>GPT Answer</h2>
          <p>{stepState.gptAnswer}</p>
        </div>
      )}
      {copiedContent?.folderStructure && <CopySections content={copiedContent.folderStructure} title={'Folder Structure'} />}
      {joinedContent && <CopySections content={joinedContent} title={'Files Content'} />}
    </>
  );
};

export default Status;
