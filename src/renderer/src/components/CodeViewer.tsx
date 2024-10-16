import React from 'react';
import { Box, Paper } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewerProps {
  content: string;
  language: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ content, language }) => {
  return (
    <Paper elevation={3} sx={{ width: '100%', overflowX: 'auto' }}>
      <Box p={2}>
        <SyntaxHighlighter language={language} style={dracula}>
          {content}
        </SyntaxHighlighter>
      </Box>
    </Paper>
  );
};

export default CodeViewer;
