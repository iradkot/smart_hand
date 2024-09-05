import React, { useState } from 'react';
import { useStore } from "../../../stateManagement/zustand/useStore";
import { StepState } from "../../../types";
import { invokeCreateAndRunTest, invokeReadPackageJson } from "../../../../../invokers/ipcInvokers"; // Add new invoker
import ContentTreeFileSelector from "../../../components/FileSelector";
import { Button, Typography, CircularProgress } from '@mui/material';
import styled from 'styled-components';

const getDirectoryPath = (filePath: string) => {
  const lastSlashIndex = filePath.lastIndexOf('\\');
  return lastSlashIndex !== -1 ? filePath.substring(0, lastSlashIndex) : filePath;
};

// Styled-components for the wrapper
const Wrapper = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

// Styled-components for the form control
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const CreateTestSection: React.FC = () => {
  const stepState = useStore((state) => state.stepState) as StepState;
  const initializeSession = useStore((state) => state.initializeSession);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false); // New pending state
  const [packageJsonContent, setPackageJsonContent] = useState<string | null>(null); // To hold the content of package.json

  const copiedContent = stepState?.copiedContent;

  const handlePackageJsonUpload = async () => {
    try {
      // Open the dialog to select the file and get the file path
      const content = await invokeReadPackageJson(stepState.directoryPath); // This is an IPC call to the main process
      if (content) {
        setPackageJsonContent(content);
      } else {
        setTestStatus('No file selected.');
      }
    } catch (err) {
      setTestStatus('Failed to read package.json');
    }
  };

  const handleCreateTest = async () => {
    if (!!packageJsonContent?.length && stepState) {
      let sessionId = stepState.sessionId;
      if (!sessionId) {
        sessionId = initializeSession();
      }
      const filePath = selectedFile[0];
      const directoryPath = getDirectoryPath(filePath);
      const fileContent = JSON.stringify(selectedFile, null, 2);

      const frameworkFromPackageJson = packageJsonContent
        ? JSON.parse(packageJsonContent)?.scripts?.test
        : null;

      // if (!frameworkFromPackageJson) {
      //   setTestStatus('No test framework found in package.json');
      //   return;
      // }

      const instructions = `Create unit test using based on the following package.json ${packageJsonContent}, verify use only known utils from version of the unit test framework you see in this package.json. \n the test should be for the attached file. The test should cover all the edge cases and scenarios, and it should be placed in the same directory as the file. Make sure you understand how the file exports its functions and classes.`;
      console.log('Instructions:', instructions);

      try {
        setIsPending(true); // Start pending state
        const result = await invokeCreateAndRunTest({ sessionId, directoryPath, fileContent, instructions });
        setTestStatus(result.success ? 'Test created and run successfully.' : `Error: ${result.error}`);
      } catch (err) {
        setTestStatus(
          err instanceof Error
            ? `Failed to create and run test: ${err.message}`
            : 'Failed to create and run test: An unknown error occurred.'
        );
      } finally {
        setIsPending(false); // End pending state
      }
    } else {
      setTestStatus('Missing required data for creating test.');
    }
  };

  return (
    <Wrapper>
      <Typography variant="h4" gutterBottom>Create and Run Test</Typography>
      {copiedContent?.contentTree && (
        <ContentTreeFileSelector
          contentTree={copiedContent.contentTree}
          selected={selectedFile}
          setSelected={setSelectedFile}
          allowMultiple={false} // Only allow single file selection
        />
      )}
      <Button onClick={handlePackageJsonUpload} variant="contained" color="primary">
        Upload package.json
      </Button>
      <Form onSubmit={(e) => { e.preventDefault(); handleCreateTest(); }}>
        <Button type="submit" variant="contained" color="primary" disabled={!selectedFile.length || !packageJsonContent || isPending}>
          {isPending ? <CircularProgress size={24} /> : 'Create Test'}
        </Button>
        {testStatus && <Typography variant="body1" color={testStatus.startsWith('Error') ? 'error' : 'success'}>{testStatus}</Typography>}
      </Form>
    </Wrapper>
  );
};

export default CreateTestSection;
