import { ContentNode } from '../types/pathHarvester.types';

/**
 * Recursively formats the content from files in a content tree structure into a single organized string,
 * including the local path above each file's content.
 *
 * @param {ContentNode | undefined} node - The current node in the directory tree.
 * @returns {string} - A formatted string containing the local paths and contents of all files.
 */
export const formatFileContents = (node: ContentNode | undefined): string => {
  if (!node) return '';
  if (node.type === 'file' && node.content) {
    return `${node.localPath}:\n${node.content}`;  // Include the localPath above the content
  } else if (node.type === 'directory' && node.children) {
    return Object.values(node.children)
      .map(child => formatFileContents(child))
      .join('\n');  // Joining with a newline for better organization
  }
  return '';
};

/**
 * Retrieves the content of a file from the content tree based on the given file path.
 *
 * @param {ContentNode | undefined} node - The current node in the directory tree.
 * @param {string} filePath - The file path to search for.
 * @returns {string | null} - The content of the file if found, otherwise null.
 */
export const getFileContentFromPath = (node: ContentNode | undefined, filePath: string): string | null => {
  if (!node) return null;

  // Check if the node is a file and matches the provided filePath
  if (node.type === 'file' && node.localPath === filePath) {
    return node.content ?? null;
  }

  // If the node is a directory, recursively search its children
  if (node.type === 'directory' && node.children) {
    for (const childKey in node.children) {
      const child = node.children[childKey];
      const content = getFileContentFromPath(child, filePath);
      if (content) return content;
    }
  }

  // Return null if the filePath was not found
  return null;
};

