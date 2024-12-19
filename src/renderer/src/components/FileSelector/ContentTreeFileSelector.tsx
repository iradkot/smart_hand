import React, { useState, useMemo } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { ContentNode } from 'src/types/pathHarvester.types';
import {
  FolderFileSelectorProps,
  ControlledFolderFileSelectorProps,
} from 'src/renderer/src/types/FileSelector.types';
import { sortContentNodes } from '../../utils/FileSelector.utils';

import { getNodeSelectionState, handleCheckChange } from './utils/selectionState';
import { useNodeMap } from './hooks/useNodeMap';
import { getRecursiveInfo } from './utils/recursiveInfo';
import { NodeLabel } from './components/NodeLabel';
import { SelectedSummary } from './components/SelectedSummary';

const ContentTreeFileSelector: React.FC<FolderFileSelectorProps> = (props) => {
  const {
    contentTree,
    allowMultiple = true,
    initialSelected = [],
    allowFolderSelection = false,
  } = props;

  let effectiveSelected: string[];
  let effectiveSetSelected: (files: string[]) => void;

  if ('persistSelectedState' in props && props.persistSelectedState) {
    const [localSelectedFiles, setLocalSelectedFiles] = useState<string[]>(initialSelected);
    effectiveSelected = localSelectedFiles;
    effectiveSetSelected = setLocalSelectedFiles;
  } else {
    const { selected, setSelected } = props as ControlledFolderFileSelectorProps;
    effectiveSelected = selected;
    effectiveSetSelected = setSelected;
  }

  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const handleToggle = (itemId: string) => {
    setExpandedNodes((prevExpanded) =>
      prevExpanded.includes(itemId)
        ? prevExpanded.filter((id) => id !== itemId)
        : [...prevExpanded, itemId]
    );
  };

  const nodeMap = useNodeMap(contentTree);

  // Mark all descendants of a node as covered
  const coverDescendants = (node: ContentNode, covered: Set<string>) => {
    covered.add(node.localPath);
    if (node.children) {
      for (const child of Object.values(node.children)) {
        coverDescendants(child, covered);
      }
    }
  };

  const selectedStats = useMemo(() => {
    let totalSelectedItems = 0;
    let totalSelectedChars = 0;
    const coveredPaths = new Set<string>();

    const selectedDirs: ContentNode[] = [];
    const selectedFiles: ContentNode[] = [];

    // Separate selected nodes into directories and files
    for (const path of effectiveSelected) {
      const node = nodeMap.get(path);
      if (!node) continue;
      if (node.type === 'directory') {
        selectedDirs.push(node);
      } else {
        selectedFiles.push(node);
      }
    }

    // Process directories first
    for (const dirNode of selectedDirs) {
      // If this directory (or its ancestors) is already covered, skip
      if (coveredPaths.has(dirNode.localPath)) {
        continue;
      }

      const info = getRecursiveInfo(dirNode);
      totalSelectedItems += info.totalItems;
      totalSelectedChars += info.totalChars;

      coverDescendants(dirNode, coveredPaths);
    }

    // Process files
    for (const fileNode of selectedFiles) {
      // If already covered by a directory, skip
      if (coveredPaths.has(fileNode.localPath)) {
        continue;
      }

      const fileInfo = getRecursiveInfo(fileNode);
      totalSelectedItems += fileInfo.totalItems;
      totalSelectedChars += fileInfo.totalChars;

      coveredPaths.add(fileNode.localPath);
    }

    return { totalSelectedItems, totalSelectedChars };
  }, [effectiveSelected, nodeMap]);

  const renderTreeItems = (node: ContentNode): React.ReactNode => {
    const nodeId = node.localPath;
    const selectionState = getNodeSelectionState(
      node,
      effectiveSelected,
      allowFolderSelection
    );

    return (
      <TreeItem
        key={nodeId}
        itemId={nodeId}
        label={
          <NodeLabel
            node={node}
            selectionState={selectionState}
            allowMultiple={allowMultiple}
            allowFolderSelection={allowFolderSelection}
            effectiveSelected={effectiveSelected}
            setSelected={effectiveSetSelected}
            onCheckChange={handleCheckChange}
            getRecursiveInfo={getRecursiveInfo}
            expandedNodes={expandedNodes}
          />
        }
        onClick={() => handleToggle(nodeId)}
      >
        {node.children &&
          Object.values(node.children)
            .sort(sortContentNodes)
            .map((childNode) => renderTreeItems(childNode))}
      </TreeItem>
    );
  };

  return (
    <>
      <SimpleTreeView>{renderTreeItems(contentTree)}</SimpleTreeView>
      <SelectedSummary
        totalItems={selectedStats.totalSelectedItems}
        totalChars={selectedStats.totalSelectedChars}
      />
    </>
  );
};

export default ContentTreeFileSelector;
