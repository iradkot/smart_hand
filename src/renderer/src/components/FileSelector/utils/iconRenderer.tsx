import React from 'react';
import { FolderOpen, Folder, InsertDriveFile } from '@material-ui/icons';
import { ContentNode } from 'src/types/pathHarvester.types';

export function renderNodeIcon(node: ContentNode, isExpanded: boolean) {
  if (node.type === 'file') {
    return <InsertDriveFile style={{ marginRight: 4 }} color="action" />;
  } else {
    return isExpanded ? (
      <FolderOpen style={{ marginRight: 4 }} color="primary" />
    ) : (
      <Folder style={{ marginRight: 4 }} color="primary" />
    );
  }
}
