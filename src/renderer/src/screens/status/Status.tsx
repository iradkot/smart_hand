// src/renderer/src/screens/status/Status.tsx

import React, { useEffect, useState } from 'react';
import { useStore } from '../../stateManagement/zustand/useStore';
import { Container, Header } from './Status.styles';
import LoadingError from './components/LoadingError';
import ContentTabs from './components/ContentTabs';
import CreateTestSection from './components/CreateTestSection/CreateTestSection';
import { Box, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore  } from '@material-ui/icons';
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

  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

  const [displayContent, setDisplayContent] = useState<string>('');
  const [displayStructure, setDisplayStructure] = useState<string>('');

  useEffect(() => {
    const savedExpanded = localStorage.getItem('statusExpanded');
    if (savedExpanded) {
      setExpanded(savedExpanded);
    }
  }, []);

  useEffect(() => {
    if (expanded) {
      localStorage.setItem('statusExpanded', expanded);
    }
  }, [expanded]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const savedSelectedPaths = localStorage.getItem('selectedPaths');
    if (savedSelectedPaths) {
      setSelectedPaths(JSON.parse(savedSelectedPaths));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedPaths', JSON.stringify(selectedPaths));
  }, [selectedPaths]);

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
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Copy Content and Manage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mt={2}>
              <ContentTreeFileSelector
                contentTree={copiedContent.contentTree}
                selected={selectedPaths}
                setSelected={setSelectedPaths}
                allowMultiple={true}
                allowFolderSelection={true}
              />
              <ContentTabs
                displayContent={displayContent}
                displayStructure={displayStructure}
              />
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
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMore  />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Create and Run Test</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateTestSection />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default Status;
