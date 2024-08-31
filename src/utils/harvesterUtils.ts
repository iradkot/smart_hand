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
