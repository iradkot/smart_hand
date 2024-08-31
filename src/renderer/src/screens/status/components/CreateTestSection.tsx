// components/CreateTestSection.tsx
import React, { useState } from 'react';
import {useStore} from "../../../stateManagement/zustand/useStore";
import {StepState} from "../../../types";
import {invokeCreateAndRunTest} from "../../../../../invokers/ipcInvokers";

const CreateTestSection: React.FC = () => {
  const stepState = useStore((state) => state.stepState) as StepState;
  const initializeSession = useStore((state) => state.initializeSession);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const copiedContent = stepState?.copiedContent;
  const joinedContent = Array.isArray(copiedContent?.contentTree)
    ? copiedContent.contentTree
      .filter(item => item.isFile && item.content)
      .map(item => item.content)
      .join('\n')
    : '';

  const handleCreateTest = async () => {
    if (stepState && copiedContent?.folderStructure) {
      let sessionId = stepState.sessionId;
      if (!sessionId) {
        sessionId = initializeSession();
      }
      const directoryPath = stepState.directoryPath;
      const fileContent = joinedContent;
      const instructions = 'unit tests';

      try {
        const result = await invokeCreateAndRunTest({ sessionId, directoryPath, fileContent, instructions });
        setTestStatus(result.success ? 'Test created and run successfully.' : `Error: ${result.error}`);
      } catch (err) {
        setTestStatus(
          err instanceof Error
            ? `Failed to create and run test: ${err.message}`
            : 'Failed to create and run test: An unknown error occurred.'
        );
      }
    } else {
      setTestStatus('Missing required data for creating test.');
    }
  };

  return (
    <div>
      <h3>Create and Run Test</h3>
      <button onClick={handleCreateTest}>Create Test</button>
      {testStatus && <p>{testStatus}</p>}
    </div>
  );
};

export default CreateTestSection;
