import React, { useState } from 'react';
import { useStore } from "../../../stateManagement/zustand/useStore";
import { invokeCreateAndRunTest, invokeReadPackageJson } from "../../../../../invokers/ipcInvokers";
import ContentTreeFileSelector from "../../../components/FileSelector";
import { Button, Typography, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { getFileContentFromPath } from "../../../../../utils/harvesterUtils";

const getDirectoryPath = (filePath: string) => {
  const lastSlashIndex = filePath.lastIndexOf('\\');
  return lastSlashIndex !== -1 ? filePath.substring(0, lastSlashIndex) : filePath;
};

const Wrapper = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const CreateTestSection: React.FC = () => {
  const initializeSession = useStore((state) => state.initializeSession);
  const stepState = useStore((state) => state.stepState);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [packageJsonContent, setPackageJsonContent] = useState<string | null>(null);
  const [packageJsonPath, setPackageJsonPath] = useState<string | null>(null);

  const copiedContent = stepState?.copiedContent;

  const handlePackageJsonUpload = async () => {
    try {
      const { content, packageJsonPath: packageJsonPathResponse } = await invokeReadPackageJson(stepState.directoryPath);
      if (content) {
        setPackageJsonContent(content);
        setPackageJsonPath(packageJsonPathResponse);
      } else {
        setTestStatus('No file selected.');
      }
    } catch (err) {
      setTestStatus('Failed to read package.json');
    }
  };

  const handleCreateTest = async () => {
    if (!!packageJsonContent?.length && stepState && typeof packageJsonPath === 'string') {
      let sessionId = stepState.sessionId;
      if (!sessionId) {
        sessionId = initializeSession();
      }
      const filePath = selectedFile[0];
      const directoryPath = getDirectoryPath(filePath);
      const fileContent = `${filePath}: \n ${getFileContentFromPath(copiedContent?.contentTree, filePath)}`;
      const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);

      const instructions = ``;

      try {
        setIsPending(true);
        const result = await invokeCreateAndRunTest({
          sessionId,
          directoryPath,
          fileContent,
          fileName,
          packageJsonPath,
          instructions,
          packageJsonContent,
        });
        setTestStatus(result.success ? 'Test created and run successfully.' : `Error: ${result.error}`);
      } catch (err) {
        setTestStatus(
          err instanceof Error
            ? `Failed to create and run test: ${err.message}`
            : 'Failed to create and run test: An unknown error occurred.'
        );
      } finally {
        setIsPending(false);
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
          allowMultiple={false}
        />
      )}
      <Button onClick={handlePackageJsonUpload} variant="contained" color="primary">
        Upload package.json
      </Button>
      {packageJsonPath && (
        <Typography variant="body1" color="textSecondary">
          package.json path: {packageJsonPath}
        </Typography>
      )}
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
