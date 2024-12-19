import React, { useState, useEffect, useMemo } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Checkbox } from '@mui/material';
import { FolderOpen, Folder, InsertDriveFile } from '@material-ui/icons';
import { ContentNode } from 'src/types/pathHarvester.types';
import {
  FolderFileSelectorProps,
  ControlledFolderFileSelectorProps,
} from 'src/renderer/src/types/FileSelector.types';
import { getNameFromPath, sortContentNodes } from '../../utils/FileSelector.utils';

const ContentTreeFileSelector: React.FC<FolderFileSelectorProps> = (props) => {
  const {
    contentTree,
    allowMultiple = true,
    initialSelected = [],
    allowFolderSelection = false,
  } = props;

  // Initialize selected files state
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

  const getNodeSelectionState = (
    node: ContentNode
  ): 'checked' | 'indeterminate' | 'unchecked' => {
    if (node.type === 'file') {
      return effectiveSelected.includes(node.localPath) ? 'checked' : 'unchecked';
    } else if (node.type === 'directory') {
      if (allowFolderSelection && effectiveSelected.includes(node.localPath)) {
        return 'checked';
      }
      if (node.children) {
        const childStates = Object.values(node.children).map(getNodeSelectionState);
        const allChecked = childStates.every((state) => state === 'checked');
        const allUnchecked = childStates.every((state) => state === 'unchecked');
        if (allChecked) {
          return 'checked';
        } else if (allUnchecked) {
          return 'unchecked';
        } else {
          return 'indeterminate';
        }
      }
    }
    return 'unchecked';
  };

  const handleCheckChange = (node: ContentNode, checked: boolean) => {
    let newSelectedSet = allowMultiple ? new Set(effectiveSelected) : new Set<string>();

    if (!allowMultiple && checked) {
      // In single-select mode, only one item can be selected
      newSelectedSet.clear();
    }

    const updateSelection = (
      node: ContentNode,
      checked: boolean,
      selectedSet: Set<string>
    ) => {
      if (node.type === 'file' || (allowFolderSelection && node.type === 'directory')) {
        if (checked) {
          selectedSet.add(node.localPath);
        } else {
          selectedSet.delete(node.localPath);
        }
      }

      if (allowMultiple && node.children) {
        // Only update children if multiple selection is allowed
        Object.values(node.children).forEach((child) =>
          updateSelection(child, checked, selectedSet)
        );
      }
    };

    updateSelection(node, checked, newSelectedSet);
    effectiveSetSelected(Array.from(newSelectedSet));
  };

  const handleToggle = (itemId: string) => {
    setExpandedNodes((prevExpanded) =>
      prevExpanded.includes(itemId)
        ? prevExpanded.filter((id) => id !== itemId)
        : [...prevExpanded, itemId]
    );
  };

  // Recursive info calculation for a node
  const getRecursiveInfo = (node: ContentNode): { totalItems: number; totalChars: number } => {
    if (node.type === 'file') {
      // For files: totalItems=1, totalChars = length of the file content
      const fileContent = node.content || '';
      return { totalItems: 1, totalChars: fileContent.length };
    } else {
      // For directories: totalItems counts all descendants + 1 for itself,
      // totalChars = directory name length + sum of all descendants
      const fileNameLength = node.localPath.length;
      let totalItems = 1;
      let totalChars = fileNameLength;
      if (node.children) {
        for (const child of Object.values(node.children)) {
          const childInfo = getRecursiveInfo(child);
          totalItems += childInfo.totalItems;
          totalChars += childInfo.totalChars;
        }
      }
      return { totalItems, totalChars };
    }
  };

  const renderLabel = (node: ContentNode) => {
    const label = getNameFromPath(node.localPath);
    const selectionState = getNodeSelectionState(node);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const checked = event.target.checked;
      handleCheckChange(node, checked);
    };

    // Determine if we show a checkbox
    const isFolderSelectable =
      allowFolderSelection && (allowMultiple || (!allowMultiple && !node.children));

    // Always render a checkbox area for consistent layout
    const showCheckbox = node.type === 'file' || isFolderSelectable;
    const disabledCheckbox = node.type === 'directory' && !isFolderSelectable;

    // For the display info next to the label:
    let extraInfo = '';
    if (node.type === 'directory') {
      const { totalItems, totalChars } = getRecursiveInfo(node);
      extraInfo = ` (${totalItems} total items, ${totalChars} total chars)`;
    } else {
      // For files, just show chars = file content length
      const fileContent = node.content || '';
      extraInfo = ` (${fileContent.length} chars)`;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '32px',
          lineHeight: '1.5',
        }}
      >
        <div style={{ marginRight: 4 }}>
          {showCheckbox ? (
            <Checkbox
              checked={selectionState === 'checked'}
              indeterminate={selectionState === 'indeterminate'}
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              size="small"
              disabled={disabledCheckbox}
            />
          ) : (
            // If no checkbox should appear, keep space
            <div style={{ width: '24px', height: '24px' }} />
          )}
        </div>
        <span style={{ marginRight: 4 }}>{renderNodeIcon(node)}</span>
        <span>{label}{extraInfo}</span>
      </div>
    );
  };

  const renderNodeIcon = (node: ContentNode) => {
    const nodeId = node.localPath;
    const isExpanded = expandedNodes.includes(nodeId);
    if (node.type === 'file') {
      return <InsertDriveFile style={{ marginRight: 4 }} color="action" />;
    } else {
      return isExpanded ? (
        <FolderOpen style={{ marginRight: 4 }} color="primary" />
      ) : (
        <Folder style={{ marginRight: 4 }} color="primary" />
      );
    }
  };

  const renderTreeItems = (node: ContentNode): React.ReactNode => {
    const nodeId = node.localPath;

    return (
      <TreeItem
        key={nodeId}
        itemId={nodeId}
        label={renderLabel(node)}
        onClick={() => handleToggle(nodeId)}
      >
        {node.children &&
          Object.values(node.children)
            .sort(sortContentNodes)
            .map((childNode) => renderTreeItems(childNode))}
      </TreeItem>
    );
  };

  // Build a map for quick lookups of nodes by localPath
  const nodeMap = useMemo(() => {
    const map = new Map<string, ContentNode>();

    const buildMap = (node: ContentNode) => {
      map.set(node.localPath, node);
      if (node.children) {
        Object.values(node.children).forEach(buildMap);
      }
    };
    buildMap(contentTree);
    return map;
  }, [contentTree]);

  // Compute stats for selected nodes
  const selectedStats = useMemo(() => {
    let totalSelectedItems = 0;
    let totalSelectedChars = 0;
    for (const path of effectiveSelected) {
      const node = nodeMap.get(path);
      if (node) {
        const info = getRecursiveInfo(node);
        totalSelectedItems += info.totalItems;
        totalSelectedChars += info.totalChars;
      }
    }
    return { totalSelectedItems, totalSelectedChars };
  }, [effectiveSelected, nodeMap]);

  // A fixed-position summary box
  const summaryBoxStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px 12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontSize: '14px',
    zIndex: 9999,
  };

  return (
    <>
      <SimpleTreeView>{renderTreeItems(contentTree)}</SimpleTreeView>
      <div style={summaryBoxStyle}>
        <strong>Selected Summary:</strong><br />
        Items: {selectedStats.totalSelectedItems}<br />
        Chars: {selectedStats.totalSelectedChars}
      </div>
    </>
  );
};

export default ContentTreeFileSelector;
