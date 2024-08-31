// components/CreateTestSection.tsx
import React, { useState } from 'react';
import {useStore} from "../../../stateManagement/zustand/useStore";
import {StepState} from "../../../types";
import {invokeCreateAndRunTest} from "../../../../../invokers/ipcInvokers";
import ContentTreeFileSelector from "../../../components/FileSelector";

const CreateTestSection: React.FC = () => {
  const stepState = useStore((state) => state.stepState) as StepState;
  const initializeSession = useStore((state) => state.initializeSession);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const copiedContent = stepState?.copiedContent;

  const handleFileSelect = (files: string[]) => {
    setSelectedFiles(files);
  };


  const handleCreateTest = async () => {
    if (stepState && copiedContent?.folderStructure) {
      let sessionId = stepState.sessionId;
      if (!sessionId) {
        sessionId = initializeSession();
      }
      const directoryPath = stepState.directoryPath;
      const fileContent = JSON.stringify(selectedFiles, null, 2); // Sending selected files instead of full contentTree
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
      {copiedContent?.contentTree && (
        <ContentTreeFileSelector contentTree={copiedContent.contentTree} onFileSelect={handleFileSelect} />
      )}
      <button onClick={handleCreateTest}>Create Test</button>
      {testStatus && <p>{testStatus}</p>}
    </div>
  );
};

export default CreateTestSection;
