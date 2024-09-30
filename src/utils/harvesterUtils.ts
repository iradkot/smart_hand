// src/main/smartTasks/createTestTask/utils/fileUtils.ts

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

/**
 * Generates a tree-like string representation of file names from a ContentNode.
 *
 * @param {ContentNode} contentNode - The root ContentNode to traverse.
 * @returns {string} - A string representing the file structure in a tree-like format.
 */
export const generateFileTree = (contentNode: ContentNode): string => {
  const lines: string[] = [];

  /**
   * Recursive helper function to traverse the ContentNode.
   *
   * @param {ContentNode} node - Current ContentNode being traversed.
   * @param {string} prefix - String prefix for formatting the tree structure.
   * @param {boolean} isLast - Indicates if the current node is the last child.
   */
  function traverse(node: ContentNode, prefix: string, isLast: boolean) {
    if (node.type === 'directory' && node.children) {
      const entries = Object.entries(node.children);
      entries.forEach(([name, child], index) => {
        const isLastChild = index === entries.length - 1;
        const connector = isLastChild ? '└── ' : '├── ';
        if (child.type === 'file') {
          lines.push(`${prefix}${connector}${name}`);
        } else if (child.type === 'directory') {
          lines.push(`${prefix}${connector}${name}`);
          const newPrefix = prefix + (isLastChild ? '    ' : '│   ');
          traverse(child, newPrefix, isLastChild);
        }
      });
    }
  }

  // Start traversal from the root
  traverse(contentNode, '', true);

  return lines.join('\n');
};
