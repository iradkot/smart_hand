// src/screens/status/components/CodeContentView.tsx

import React from 'react';
import { useStore } from '../../../stateManagement/zustand/useStore';
import { formatFileContents } from '../../../../../utils/harvesterUtils/harvesterUtils';
import { Typography, Box } from '@mui/material';
import CopySections from '../../../components/CopySections/CopySections';

const CodeContentView: React.FC = () => {
  const stepState = useStore((state) => state.stepState);
  const copiedContent = stepState?.copiedContent;

  if (!copiedContent?.contentTree) {
    return <Typography variant="body1">No code content available.</Typography>;
  }

  const codeContent = formatFileContents(copiedContent.contentTree);

  return (
    <Box>
      <CopySections content={codeContent} title="Code Content" language="typescript" />
    </Box>
  );
};

export default CodeContentView;
