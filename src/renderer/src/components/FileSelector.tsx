// src/components/FileSelector.tsx

import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ContentNode } from '../../../types/pathHarvester.types';

interface BaseFolderFileSelectorProps {
  contentTree: ContentNode;
  allowMultiple?: boolean;
  initialSelected?: string[];
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
  const { contentTree, allowMultiple = true, initialSelected = [] } = props;

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

  const handleFileToggle = (filePath: string) => {
    let updatedSelectedFiles: string[];

    if (allowMultiple) {
      updatedSelectedFiles = effectiveSelected.includes(filePath)
        ? effectiveSelected.filter((file) => file !== filePath)
        : [...effectiveSelected, filePath];
    } else {
      updatedSelectedFiles = effectiveSelected.includes(filePath)
        ? []
        : [filePath];
    }

    effectiveSetSelected(updatedSelectedFiles);
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
              onChange={() => handleFileToggle(node.localPath)}
            />
            📄 {name}
          </label>
        </li>
      );
    } else if (node.type === 'directory') {
      const folderPath = `${parentPath}/${name}`;
      const isExpanded = expandedFolders.includes(folderPath);

      return (
        <li key={node.localPath}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleFolderToggle(folderPath)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleFolderToggle(folderPath);
              }
            }}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {isExpanded ? '📂' : '📁'} <strong>{name}</strong>
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
