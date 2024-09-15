import React, { useState } from 'react';
import { ContentNode } from "../../../types/pathHarvester.types";

interface FolderFileSelectorProps {
  contentTree: ContentNode;
  selected: string[];
  setSelected: (files: string[]) => void;
  allowMultiple?: boolean; // Optional prop to specify if multiple selection is allowed
}

const ContentTreeFileSelector: React.FC<FolderFileSelectorProps> = ({ contentTree, selected, setSelected, allowMultiple = true }) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const handleFileToggle = (filePath: string) => {
    let updatedSelectedFiles;

    if (allowMultiple) {
      updatedSelectedFiles = selected.includes(filePath)
        ? selected.filter((file) => file !== filePath)
        : [...selected, filePath];
    } else {
      updatedSelectedFiles = selected.includes(filePath) ? [] : [filePath];
    }

    setSelected(updatedSelectedFiles);
  };

  const handleFolderToggle = (folderPath: string) => {
    setExpandedFolders((prevExpanded) =>
      prevExpanded.includes(folderPath)
        ? prevExpanded.filter((folder) => folder !== folderPath)
        : [...prevExpanded, folderPath]
    );
  };

  // Helper function to extract the file or folder name from a path
  const getNameFromPath = (filePath: string) => {
    return filePath.split(/[/\\]+/).filter(Boolean).pop();
  };

  const renderContentTree = (node: ContentNode, parentPath: string = '') => {
    const name = node.localPath ? getNameFromPath(node.localPath) : undefined;

    if (!name) {
      console.error("Encountered a node with an undefined 'localPath'.", node);
      return null; // Safely handle the case where localPath is undefined
    }

    if (node.type === 'file') {
      return (
        <li key={node.localPath}>
          <label>
            <input
              type={allowMultiple ? "checkbox" : "radio"}
              checked={selected.includes(node.localPath)}
              onChange={() => handleFileToggle(node.localPath)}
            />
            📄 {name}
          </label>
        </li>
      );
    }

    const folderPath = `${parentPath}/${name}`;
    const isExpanded = expandedFolders.includes(folderPath);

    return (
      <li key={node.localPath}>
        <div onClick={() => handleFolderToggle(folderPath)}>
          {isExpanded ? '📂' : '📁'} <strong>{name}</strong>
        </div>
        {isExpanded && (
          <ul>
            {node.children &&
              Object.keys(node.children).map((childKey) =>
                renderContentTree(node.children![childKey], folderPath)
              )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div>
      <ul>{renderContentTree(contentTree)}</ul>
    </div>
  );
};

export default ContentTreeFileSelector;
