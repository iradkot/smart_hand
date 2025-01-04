import React from 'react'
import { Button, Checkbox } from '@mui/material'
import { ContentNode } from 'src/types/pathHarvester.types'
import { getNameFromPath } from '../../../utils/FileSelector.utils'
import { renderNodeIcon } from '../utils/iconRenderer'
import { getRecursiveInfo } from '../utils/recursiveInfo'
import { handleCheckChange } from '../utils/selectionState'
import { invokeGetFilesImports } from 'src/invokers/ipcInvokers'

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
  contentTree: ContentNode;
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
                                                      contentTree,
                                                    }) => {
  const label = getNameFromPath(node.localPath)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    const checked = event.target.checked
    onCheckChange(node, checked, effectiveSelected, setSelected, allowMultiple, allowFolderSelection)
  }

  const handleAddImports = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type !== 'file') return;

    try {
      const result = await invokeGetFilesImports(node.localPath, contentTree);
      if (!result.success) {
        console.error('Failed to parse imports:', result.error);
        return;
      }

      const resolvedPaths = result.imports as string[];

      let newSelectedSet = allowMultiple
        ? new Set(effectiveSelected)
        : new Set<string>(effectiveSelected);

      for (const p of resolvedPaths) {
        newSelectedSet.add(p);
      }

      setSelected(Array.from(newSelectedSet));
    } catch (err) {
      console.error('Error calling get-file-imports:', err);
    }
  };



  // Determine if we show a checkbox
  const isFolderSelectable =
    allowFolderSelection && (allowMultiple || (!allowMultiple && !node.children))

  // Always render a space for checkbox for consistent layout
  const showCheckbox = node.type === 'file' || isFolderSelectable
  const disabledCheckbox = node.type === 'directory' && !isFolderSelectable

  let extraInfo = ''
  if (node.type === 'directory') {
    const { totalItems, totalChars } = getRecursiveInfo(node)
    extraInfo = ` (${totalItems} total items, ${totalChars} total chars)`
  } else {
    const fileContent = node.content || ''
    extraInfo = ` (${fileContent.length} chars)`
  }

  const isExpanded = expandedNodes.includes(node.localPath)

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
      {node.type === 'file' && (
        <Button
          variant="outlined"
          size="small"
          style={{ marginLeft: '8px' }}
          onClick={handleAddImports}
        >
          Add Imports
        </Button>
      )}
    </div>
  )
}
