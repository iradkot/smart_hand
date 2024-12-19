import React from 'react';
import { Checkbox } from '@mui/material';
import { ContentNode } from 'src/types/pathHarvester.types';
import { getNameFromPath } from '../../../utils/FileSelector.utils';
import { renderNodeIcon } from '../utils/iconRenderer';
import { getRecursiveInfo } from '../utils/recursiveInfo';
import { handleCheckChange } from '../utils/selectionState';

interface NodeLabelProps {
  node: ContentNode;
  selectionState: 'checked' | 'indeterminate' | 'unchecked';
  allowMultiple: boolean;
  allowFolderSelection: boolean;
  effectiveSelected: string[];
  setSelected: (files: string[]) => void;
  onCheckChange: typeof handleCheckChange;
  getRecursiveInfo: typeof getRecursiveInfo;
  expandedNodes: string[];
}

export const NodeLabel: React.FC<NodeLabelProps> = ({
                                                      node,
                                                      selectionState,
                                                      allowMultiple,
                                                      allowFolderSelection,
                                                      effectiveSelected,
                                                      setSelected,
                                                      onCheckChange,
                                                      getRecursiveInfo,
                                                      expandedNodes,
                                                    }) => {
  const label = getNameFromPath(node.localPath);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const checked = event.target.checked;
    onCheckChange(node, checked, effectiveSelected, setSelected, allowMultiple, allowFolderSelection);
  };

  // Determine if we show a checkbox
  const isFolderSelectable =
    allowFolderSelection && (allowMultiple || (!allowMultiple && !node.children));

  // Always render a space for checkbox for consistent layout
  const showCheckbox = node.type === 'file' || isFolderSelectable;
  const disabledCheckbox = node.type === 'directory' && !isFolderSelectable;

  let extraInfo = '';
  if (node.type === 'directory') {
    const { totalItems, totalChars } = getRecursiveInfo(node);
    extraInfo = ` (${totalItems} total items, ${totalChars} total chars)`;
  } else {
    const fileContent = node.content || '';
    extraInfo = ` (${fileContent.length} chars)`;
  }

  const isExpanded = expandedNodes.includes(node.localPath);

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
          <div style={{ width: '24px', height: '24px' }} />
        )}
      </div>
      <span style={{ marginRight: 4 }}>{renderNodeIcon(node, isExpanded)}</span>
      <span>{label}{extraInfo}</span>
    </div>
  );
};
