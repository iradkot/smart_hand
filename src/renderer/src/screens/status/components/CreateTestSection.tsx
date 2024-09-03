import React, { useState } from 'react';
import { useStore } from "../../../stateManagement/zustand/useStore";
import { StepState } from "../../../types";
import { invokeCreateAndRunTest } from "../../../../../invokers/ipcInvokers";
import ContentTreeFileSelector from "../../../components/FileSelector";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, CircularProgress } from '@mui/material';
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
`;

// Styled-components for the form control
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CreateTestSection: React.FC = () => {
  const stepState = useStore((state) => state.stepState) as StepState;
  const initializeSession = useStore((state) => state.initializeSession);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('jest');
  const [isPending, setIsPending] = useState<boolean>(false); // New pending state

  const copiedContent = stepState?.copiedContent;

  const handleCreateTest = async () => {
    if (selectedFile.length > 0 && stepState) {
      let sessionId = stepState.sessionId;
      if (!sessionId) {
        sessionId = initializeSession();
      }
      const filePath = selectedFile[0];
      const directoryPath = getDirectoryPath(filePath);
      const fileContent = JSON.stringify(selectedFile, null, 2);
      const instructions = `Create unit test using ${selectedFramework} for the attached file. The test should cover all the edge cases and scenarios, and it should be placed in the same directory as the file. Make sure you understand how the file exports its functions and classes.`;

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
      <Form onSubmit={(e) => { e.preventDefault(); handleCreateTest(); }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Test Framework</InputLabel>
          <Select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            label="Select Test Framework"
          >
            <MenuItem value="jest">Jest</MenuItem>
            <MenuItem value="jest-rtl">Jest with React Testing Library</MenuItem>
            <MenuItem value="mocha-chai">Mocha with Chai</MenuItem>
            <MenuItem value="mocha-enzyme">Mocha with Enzyme</MenuItem>
            <MenuItem value="jasmine">Jasmine</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" disabled={selectedFile.length === 0 || isPending}>
          {isPending ? <CircularProgress size={24} /> : 'Create Test'}
        </Button>
        {testStatus && <Typography variant="body1" color={testStatus.startsWith('Error') ? 'error' : 'success'}>{testStatus}</Typography>}
      </Form>
    </Wrapper>
  );
};

export default CreateTestSection;
