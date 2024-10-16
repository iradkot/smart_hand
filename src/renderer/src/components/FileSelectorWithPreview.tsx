import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ExpandMore, ChevronRight } from '@material-ui/icons';
import CodeViewer from './CodeViewer';
import { getFileContentFromPath } from "../../../utils/harvesterUtils/harvesterUtils";
import { ContentNode } from "../../../types/pathHarvester.types";
import { RichTreeView } from "@mui/x-tree-view";

interface FileSelectorWithPreviewProps {
  contentTree: ContentNode;
}

const FileSelectorWithPreview: React.FC<FileSelectorWithPreviewProps> = ({ contentTree }) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');

  const handleSelect = (nodeId: string) => {
    const content = getFileContentFromPath(contentTree, nodeId);
    setSelectedFileContent(content || '');
  };

  const renderTree = (node: ContentNode): any => ({
    id: node.localPath,
    label: node.localPath.split('/').pop(),
    children: node.children
      ? Object.values(node.children).map((child) => renderTree(child))
      : undefined,
    onClick: () => node.type === 'file' && handleSelect(node.localPath),
  });

  return (
    <Box>
      <RichTreeView
        items={[renderTree(contentTree)]}
        slots={{
          collapseIcon: ExpandMore,
          expandIcon: ChevronRight,
        }}
        sx={{ flexGrow: 1, overflowY: 'auto' }}
      />
      {selectedFileContent && (
        <Box mt={2}>
          <Typography variant="h6">Code Preview:</Typography>
          <CodeViewer content={selectedFileContent} language="typescript" />0
        </Box>
      )}
    </Box>
  );
};

export default FileSelectorWithPreview;
