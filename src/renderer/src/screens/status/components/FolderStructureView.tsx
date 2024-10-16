// src/screens/status/components/FolderStructureView.tsx

import React from 'react';
import { useStore } from '../../../stateManagement/zustand/useStore';
import { generateFileTree } from '../../../../../utils/harvesterUtils/harvesterUtils';
import { Typography, Box } from '@mui/material';
import CopySections from '../../../components/CopySections/CopySections';

const FolderStructureView: React.FC = () => {
  const stepState = useStore((state) => state.stepState);
  const copiedContent = stepState?.copiedContent;

  if (!copiedContent?.contentTree) {
    return <Typography variant="body1">No folder structure available.</Typography>;
  }

  const folderStructure = generateFileTree(copiedContent.contentTree);

  return (
    <Box>
      <CopySections content={folderStructure} title="Folder Structure" language="text" />
    </Box>
  );
};

export default FolderStructureView;
