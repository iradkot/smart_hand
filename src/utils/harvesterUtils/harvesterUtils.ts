import {ContentNode} from '../../types/pathHarvester.types';

/**
 * Recursively traverses the ContentNode based on path segments to find target files.
 *
 * @param {object} params - The parameters for the function.
 * @param {ContentNode} params.node - The current node in the directory tree.
 * @param {string[]} params.targetPathSegments - The path segments of the target path.
 * @param {number} params.currentIndex - The current index in the path segments.
 * @param {Record<string, string>} [params.result={}] - The accumulator for results.
 * @returns {Record<string, string>} - A record of file paths and their contents.
 */
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
   */
  function traverse(node: ContentNode, prefix: string) {
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
          traverse(child, newPrefix);
        }
      });
    }
  }

  // Start traversal from the root
  traverse(contentNode, '');

  return lines.join('\n');
};

/**
 * Generates a flat list of simplified relative file paths from a ContentNode.
 *
 * @param {ContentNode} contentNode - The root ContentNode to traverse.
 * @returns {string[]} - An array of simplified relative file paths.
 */
export const generateSimplifiedFilePaths = (contentNode: ContentNode): string[] => {
  const filePaths: string[] = [];

  function traverse(node: ContentNode, currentPath: string) {
    if (node.type === 'file') {
      filePaths.push(currentPath);
    } else if (node.type === 'directory' && node.children) {
      for (const [name, childNode] of Object.entries(node.children)) {
        const childPath = currentPath ? `${currentPath}/${name}` : name;
        traverse(childNode, childPath);
      }
    }
  }

  traverse(contentNode, '');
  return filePaths;
};

export const generateSelectedFolderStructure = (
  node: ContentNode,
  selectedPaths: string[],
  currentPath: string = ''
): string => {
  const lines: string[] = [];

  const normalizedCurrentPath = currentPath ? currentPath : node.localPath;

  if (selectedPaths.includes(node.localPath)) {
    lines.push(normalizedCurrentPath || '.'); // Use '.' for root
  }

  if (node.type === 'directory' && node.children) {
    for (const [name, childNode] of Object.entries(node.children)) {
      const childPath = normalizedCurrentPath
        ? `${normalizedCurrentPath}/${name}`
        : name;
      const childStructure = generateSelectedFolderStructure(
        childNode,
        selectedPaths,
        childPath
      );
      if (childStructure) {
        lines.push(childStructure);
      }
    }
  }

  return lines.join('\n');
};

export const generateSelectedFileContents = (
  node: ContentNode,
  selectedPaths: string[]
): string => {
  let content = '';

  if (selectedPaths.includes(node.localPath)) {
    if (node.type === 'file' && node.content) {
      content += `${node.localPath}:\n${node.content}\n`;
    }
  }

  if (node.type === 'directory' && node.children) {
    for (const childNode of Object.values(node.children)) {
      content += generateSelectedFileContents(childNode, selectedPaths);
    }
  }

  return content;
};

export const findNodeByPath = (node: ContentNode, path: string): ContentNode | null => {
  if (node.localPath === path) {
    return node;
  }

  if (node.type === 'directory' && node.children) {
    for (const child of Object.values(node.children)) {
      const result = findNodeByPath(child, path);
      if (result) {
        return result;
      }
    }
  }

  return null;
};
