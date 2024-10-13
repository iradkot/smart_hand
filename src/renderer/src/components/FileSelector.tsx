// src/components/FileSelector.tsx

import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ContentNode } from '../../../types/pathHarvester.types';
import {findNodeByPath} from "../../../utils/harvesterUtils/harvesterUtils";

interface BaseFolderFileSelectorProps {
  contentTree: ContentNode;
  allowMultiple?: boolean;
  initialSelected?: string[];
  allowFolderSelection?: boolean;
}

interface ControlledFolderFileSelectorProps extends BaseFolderFileSelectorProps {
  selected: string[];
  setSelected: (files: string[]) => void;
  persistSelectedState?: false;
}

interface PersistedFolderFileSelectorProps extends BaseFolderFileSelectorProps {
  persistSelectedState: true;
}

type FolderFileSelectorProps =
  | ControlledFolderFileSelectorProps
  | PersistedFolderFileSelectorProps;

const ContentTreeFileSelector: React.FC<FolderFileSelectorProps> = (props) => {
  const { contentTree, allowMultiple = true, initialSelected = [], allowFolderSelection } = props;

  // Initialize effectiveSelected and effectiveSetSelected based on props
  let effectiveSelected: string[];
  let effectiveSetSelected: (files: string[]) => void;

  // Key for storing expanded folders in localStorage
  const EXPANDED_FOLDERS_STORAGE_KEY = 'contentTreeExpandedFolders';
  const [expandedFolders, setExpandedFolders] = useLocalStorage<string[]>(
    EXPANDED_FOLDERS_STORAGE_KEY,
    []
  );

  // Conditionally use useLocalStorage for selected files
  const SELECTED_FILES_STORAGE_KEY = 'contentTreeSelectedFiles';

  if ('persistSelectedState' in props && props.persistSelectedState) {
    // If persistSelectedState is true, manage selected state internally
    const [localSelectedFiles, setLocalSelectedFiles] = useLocalStorage<string[]>(
      SELECTED_FILES_STORAGE_KEY,
      initialSelected
    );
    effectiveSelected = localSelectedFiles;
    effectiveSetSelected = setLocalSelectedFiles;
  } else {
    // Otherwise, use the selected state from props
    const { selected, setSelected } = props as ControlledFolderFileSelectorProps;
    effectiveSelected = selected;
    effectiveSetSelected = setSelected;
  }

  const toggleSelectionRecursively = (
    node: ContentNode,
    selected: string[],
    select: boolean
  ): string[] => {
    let updatedSelected = [...selected];

    if (select) {
      if (!updatedSelected.includes(node.localPath)) {
        updatedSelected.push(node.localPath);
      }
    } else {
      updatedSelected = updatedSelected.filter((p) => p !== node.localPath);
    }

    if (node.type === 'directory' && node.children) {
      for (const child of Object.values(node.children)) {
        updatedSelected = toggleSelectionRecursively(child, updatedSelected, select);
      }
    }

    return updatedSelected;
  };

  const handlePathToggle = (path: string) => {
    const select = !effectiveSelected.includes(path);
    let updatedSelectedPaths: string[];

    const node = findNodeByPath(contentTree, path);
    if (node) {
      updatedSelectedPaths = toggleSelectionRecursively(
        node,
        effectiveSelected,
        select
      );
      effectiveSetSelected(updatedSelectedPaths);
    }
  };


  const handleFolderToggle = (folderPath: string) => {
    setExpandedFolders((prevExpanded) =>
      prevExpanded.includes(folderPath)
        ? prevExpanded.filter((folder) => folder !== folderPath)
        : [...prevExpanded, folderPath]
    );
  };

  // Helper function to extract the file or folder name from a path
  const getNameFromPath = (filePath: string): string => {
    return filePath.split(/[/\\]+/).filter(Boolean).pop() || '';
  };

  const renderContentTree = (
    node: ContentNode,
    parentPath: string = ''
  ): React.ReactNode => {
    const name = getNameFromPath(node.localPath);

    if (!name) {
      console.error(
        "Encountered a node with an empty 'name' extracted from 'localPath'.",
        node
      );
      return null;
    }

    if (node.type === 'file') {
      return (
        <li key={node.localPath}>
          <label>
            <input
              type={allowMultiple ? 'checkbox' : 'radio'}
              checked={effectiveSelected.includes(node.localPath)}
              onChange={() => handlePathToggle(node.localPath)}
            />
            📄 {name}
          </label>
        </li>
      );
    } else if (node.type === 'directory') {
      const folderPath = parentPath ? `${parentPath}/${name}` : name;
      const isExpanded = expandedFolders.includes(folderPath);

      return (
        <li key={node.localPath}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {allowFolderSelection && (
              <input
                type={allowMultiple ? 'checkbox' : 'radio'}
                checked={effectiveSelected.includes(node.localPath)}
                onChange={() => handlePathToggle(node.localPath)}
              />
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleFolderToggle(folderPath)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFolderToggle(folderPath);
                }
              }}
              style={{ cursor: 'pointer', userSelect: 'none', marginLeft: '8px' }}
            >
              {isExpanded ? '📂' : '📁'} <strong>{name}</strong>
            </div>
          </div>
          {isExpanded && node.children && (
            <ul>
              {Object.keys(node.children).map((childKey) =>
                renderContentTree(node.children![childKey], folderPath)
              )}
            </ul>
          )}
        </li>
      );
    } else {
      console.error("Encountered a node with unknown 'type':", node);
      return null;
    }
  };

  return (
    <div>
      <ul>{renderContentTree(contentTree)}</ul>
    </div>
  );
};

export default ContentTreeFileSelector;
