import React, { useState } from 'react';
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

  // Recursive info calculation
  const getRecursiveInfo = (node: ContentNode): { totalItems: number; totalChars: number } => {
    const label = getNameFromPath(node.localPath);
    if (node.type === 'file') {
      return { totalItems: 1, totalChars: label.length };
    } else {
      // Directory: sum up all children
      let totalItems = 1; // Count this directory
      let totalChars = label.length; // Count this directory's name length
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

    let extraInfo = '';
    if (node.type === 'directory') {
      const { totalItems, totalChars } = getRecursiveInfo(node);
      extraInfo = ` (${totalItems} total items, ${totalChars} total chars)`;
    } else {
      // For files, just show chars for its name
      extraInfo = ` (${label.length} chars)`;
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

  return <SimpleTreeView>{renderTreeItems(contentTree)}</SimpleTreeView>;
};

export default ContentTreeFileSelector;
