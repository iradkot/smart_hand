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

  const renderTreeItems = (node: ContentNode): React.ReactNode => {
    const nodeId = node.localPath;
    const label = getNameFromPath(node.localPath);
    const selectionState = getNodeSelectionState(node);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const checked = event.target.checked;
      handleCheckChange(node, checked);
    };

    const isExpanded = expandedNodes.includes(nodeId);

    const icon =
      node.type === 'file' ? (
        <InsertDriveFile style={{ marginRight: 4 }} color="action" />
      ) : isExpanded ? (
        <FolderOpen style={{ marginRight: 4 }} color="primary" />
      ) : (
        <Folder style={{ marginRight: 4 }} color="primary" />
      );

    const isFolderSelectable =
      allowFolderSelection && (allowMultiple || (!allowMultiple && !node.children));

    return (
      <TreeItem
        key={nodeId}
        itemId={nodeId}
        label={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {(node.type === 'file' || isFolderSelectable) && (
              <Checkbox
                checked={selectionState === 'checked'}
                indeterminate={selectionState === 'indeterminate'}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
                size="small"
              />
            )}
            {icon}
            <span>{label}</span>
          </div>
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

  return <SimpleTreeView>{renderTreeItems(contentTree)}</SimpleTreeView>;
};

export default ContentTreeFileSelector;
