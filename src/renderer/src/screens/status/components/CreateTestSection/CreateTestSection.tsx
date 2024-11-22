import React from 'react';
import {useStore} from 'src/renderer/src/stateManagement/zustand/useStore';
import {invokeCreateAndRunTest, invokeReadPackageJson,} from 'src/invokers/ipcInvokers';
import ContentTreeFileSelector from 'src/renderer/src/components/FileSelector';
import {Button, CircularProgress, Typography, Paper} from '@mui/material';

import styled from 'styled-components';
import {getFileContentFromPath} from "src/utils/harvesterUtils/harvesterUtils";
import SelectedFileDisplay
  from "src/renderer/src/screens/status/components/CreateTestSection/components/SelectedFileDisplay";

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
  // Zustand store selectors
  const initializeSession = useStore((state) => state.initializeSession);
  const stepState = useStore((state) => state.stepState);
  const copiedContent = stepState?.copiedContent;

  const testStatus = useStore((state) => state.testStatus);
  const setTestStatus = useStore((state) => state.setTestStatus);
  const selectedFile = useStore((state) => state.selectedFile);
  const setSelectedFile = useStore((state) => state.setSelectedFile);
  const isPending = useStore((state) => state.isPending);
  const setIsPending = useStore((state) => state.setIsPending);
  const packageJsonContent = useStore((state) => state.packageJsonContent);
  const setPackageJsonContent = useStore((state) => state.setPackageJsonContent);
  const packageJsonPath = useStore((state) => state.packageJsonPath);
  const setPackageJsonPath = useStore((state) => state.setPackageJsonPath);

  const handlePackageJsonUpload = async () => {
    try {
      if (stepState?.directoryPath) {
        const {content, packageJsonPath: packageJsonPathResponse} =
          await invokeReadPackageJson(stepState.directoryPath);
        if (content) {
          setPackageJsonContent(content);
          setPackageJsonPath(packageJsonPathResponse);
        } else {
          setTestStatus('No package.json file found.');
        }
      } else {
        setTestStatus('Directory path is missing.');
      }
    } catch (err) {
      setTestStatus('Failed to read package.json');
    }
  };

  const handleCreateTest = async () => {
    if (
      !!packageJsonContent?.length &&
      stepState &&
      typeof packageJsonPath === 'string'
    ) {
      let sessionId = stepState.sessionId;
      if (!sessionId) {
        sessionId = initializeSession();
      }

      const filePath = selectedFile[0];
      if (!filePath || !copiedContent?.contentTree) {
        setTestStatus('No file selected.');
        return;
      }

      const directoryPath = getDirectoryPath(filePath);
      const fileContent = `${filePath}:\n${getFileContentFromPath(
        copiedContent?.contentTree,
        filePath
      )}`;
      const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);

      try {
        setIsPending(true);
        const result = await invokeCreateAndRunTest({
          sessionId,
          directoryPath,
          fileContent,
          fileName,
          packageJsonPath,
          packageJsonContent,
          contentTree: copiedContent.contentTree,
        });
        setTestStatus(
          result.success
            ? 'Test created and run successfully.'
            : `
      }Error: ${result.error}`
        );
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
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Create and Run Test
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Select a file to test, upload your <code>package.json</code>, and then click "Create Test".
      </Typography>
      {copiedContent?.contentTree && (
        <ContentTreeFileSelector
          contentTree={copiedContent.contentTree}
          selected={selectedFile}
          setSelected={setSelectedFile}
          allowMultiple={false}
        />
      )}
      <SelectedFileDisplay selectedFile={selectedFile} />
      <Button
        onClick={handlePackageJsonUpload}
        variant="contained"
        color="primary"
        disabled={Boolean(isPending)}
      >
        {isPending ? <CircularProgress size={24}/> : 'Upload package.json'}
      </Button>
      {(!selectedFile.length || !packageJsonContent) && !isPending && (
        <Typography variant="body2" color="error">
          {!selectedFile.length && 'Please select a file. '}
          {!packageJsonContent && 'Please upload package.json.'}
        </Typography>
      )}
      {packageJsonPath && (
        <Typography variant="body1" color="textSecondary">
          package.json path: {packageJsonPath}
        </Typography>
      )}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTest();
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            !selectedFile.length || !packageJsonContent || isPending
          }
        >
          {isPending ? <CircularProgress size={24}/> : 'Create Test'}
        </Button>
        {testStatus && typeof testStatus === 'string' && (
          <Typography
            variant="body1"
            color={
              testStatus.startsWith('Error') ? 'error' : 'primary'
            }
          >
            {testStatus}
          </Typography>
        )}
      </Form>
      </Paper>
    </Wrapper>
  );
};

export default CreateTestSection;
