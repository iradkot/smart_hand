// src/renderer/src/screens/status/Status.tsx

import React, { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/zustand/useStore';
import { Container, Header } from './Status.styles';
import LoadingError from './components/LoadingError';
import ContentTabs from './components/ContentTabs';
import CreateTestSection from './components/CreateTestSection';
import { Box, Button } from '@mui/material';
import { useCopyHistory } from '../../stateManagement/contexts';
import {
  generateSelectedFileContents,
  generateSelectedFolderStructure,
} from '../../../../utils/harvesterUtils/harvesterUtils';
import ContentTreeFileSelector from "../../components/FileSelector";

const Status: React.FC = () => {
  const { copyToClipboardWithToast } = useCopyHistory();
  const stepState = useStore((state) => state.stepState);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const copiedContent = stepState?.copiedContent;

  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

  // Generate content based on selected paths
  const [displayContent, setDisplayContent] = useState<string>('');
  const [displayStructure, setDisplayStructure] = useState<string>('');

  useEffect(() => {
    if (selectedPaths.length > 0 && copiedContent?.contentTree) {
      const structure = generateSelectedFolderStructure(
        copiedContent.contentTree,
        selectedPaths
      );
      const contents = generateSelectedFileContents(
        copiedContent.contentTree,
        selectedPaths
      );
      setDisplayStructure(structure);
      setDisplayContent(contents);
    } else {
      setDisplayStructure('');
      setDisplayContent('');
    }
  }, [selectedPaths, copiedContent?.contentTree]);

  return (
    <Container>
      <Header>Status</Header>
      <LoadingError isLoading={isLoading} error={error} />
      {copiedContent?.contentTree && (
        <Box mt={2}>
          {/* Reintroduce the file selector */}
          <ContentTreeFileSelector
            contentTree={copiedContent.contentTree}
            selected={selectedPaths}
            setSelected={setSelectedPaths}
            allowMultiple={true}
            allowFolderSelection={true}
          />
          {/* Pass selected content to ContentTabs */}
          <ContentTabs
            displayContent={displayContent}
            displayStructure={displayStructure}
          />
          {/* Add Copy Buttons */}
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => copyToClipboardWithToast(displayStructure, 99)}
              disabled={!displayStructure}
            >
              Copy Structure
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => copyToClipboardWithToast(displayContent, 99)}
              disabled={!displayContent}
            >
              Copy Content
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                copyToClipboardWithToast(
                  `${displayStructure}\n\n${displayContent}`,
                  99
                )
              }
              disabled={!displayStructure && !displayContent}
            >
              Copy Both
            </Button>
          </Box>
        </Box>
      )}
      <CreateTestSection />
    </Container>
  );
};

export default Status;
