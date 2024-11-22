// SelectedFileDisplay.tsx
import React from 'react';
import { Typography } from '@mui/material';

interface SelectedFileDisplayProps {
  selectedFile: string[];
}

const SelectedFileDisplay: React.FC<SelectedFileDisplayProps> = ({ selectedFile }) => {
  return selectedFile.length > 0 ? (
    <Typography variant="body1" color="textSecondary">
      Selected file: {selectedFile[0]}
    </Typography>
  ) : (
    <Typography variant="body1" color="error">
      No file selected. Please select a file to proceed.
    </Typography>
  );
};

export default SelectedFileDisplay;
