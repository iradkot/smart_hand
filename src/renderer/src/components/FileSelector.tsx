import React, { useState } from 'react';
import { ContentNode } from "../../../types/pathHarvester.types";

interface FolderFileSelectorProps {
  contentTree: ContentNode;
  onFileSelect: (selectedFiles: string[]) => void;
}

const ContentTreeFileSelector: React.FC<FolderFileSelectorProps> = ({ contentTree, onFileSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const handleFileToggle = (filePath: string) => {
    const updatedSelectedFiles = selectedFiles.includes(filePath)
      ? selectedFiles.filter((file) => file !== filePath)
      : [...selectedFiles, filePath];

    setSelectedFiles(updatedSelectedFiles);
    onFileSelect(updatedSelectedFiles);
  };

  const handleFolderToggle = (folderPath: string) => {
    setExpandedFolders((prevExpanded) =>
      prevExpanded.includes(folderPath)
        ? prevExpanded.filter((folder) => folder !== folderPath)
        : [...prevExpanded, folderPath]
    );
  };

  const renderContentTree = (node: ContentNode, parentPath: string = '') => {
    const name = node.localPath.split('\\').pop(); // Extract the name from the localPath

    if (node.type === 'file') {
      return (
        <li key={node.localPath}>
          <label>
            <input
              type="checkbox"
              checked={selectedFiles.includes(node.localPath)}
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
