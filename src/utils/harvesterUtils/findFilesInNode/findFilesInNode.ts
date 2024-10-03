// findFilesInNode.ts

/**
 * Represents the hierarchical structure of directories and files.
 * The key is the name of the directory or file, and the value is the associated content.
 */
export type ContentTree = Record<string, ContentNode>;

/**
 * Represents an entry in the contentTree, which can be either a file or a directory.
 *
 * @property {'file' | 'directory'} type - Indicates whether the node is a file or a directory.
 * @property {string | null} [content] - The content of the file (only if it's a file).
 * @property {ContentTree} [children] - Nested directories and files (only if it's a directory).
 * @property {string} localPath - The absolute path to the file or directory.
 */
export type ContentNode = {
  type: 'file' | 'directory';
  content?: string | null;
  children?: ContentTree;
  localPath: string;
};

/**
 * Normalizes a file path by replacing backslashes with forward slashes,
 * removing redundant slashes, and stripping trailing slashes.
 *
 * @param {string} filePath - The file path to normalize.
 * @returns {string} - The normalized file path.
 */
function normalizePath(filePath: string): string {
  return filePath
    .replace(/\\/g, '/')          // Replace backslashes with forward slashes
    .replace(/\/+/g, '/')         // Replace multiple slashes with single slash
    .replace(/\/$/g, '');         // Remove trailing slash if present
}

/**
 * Recursively searches for specified file paths within a ContentNode tree and retrieves their contents.
 *
 * @param {string[]} paths - An array of relative file paths to search for.
 * @param {ContentNode} node - The root ContentNode representing the directory tree.
 * @returns {Record<string, string>} - A mapping of found file paths to their contents.
 */
export function findFilesInNode(paths: string[], node: ContentNode): Record<string, string> {
  // Normalize target paths and convert them to lowercase for case-insensitive comparison
  const normalizedTargetPaths = paths.map(normalizePath).map(path => path.toLowerCase());
  const result: Record<string, string> = {};

  // Assume the rootPath is the normalized localPath of the root node
  const rootPath = normalizePath(node.localPath);

  /**
   * Recursively traverses the ContentNode tree to find and collect the contents of target files.
   *
   * @param {ContentNode} currentNode - The current node in the traversal.
   */
  function traverse(currentNode: ContentNode) {
    if (currentNode.type === 'file') {
      const normalizedFilePath = normalizePath(currentNode.localPath);

      // Check if the file is within the root directory
      if (!normalizedFilePath.startsWith(rootPath)) {
        // File is outside root, ignore
        return;
      }

      // Compute the relative path from root to the current file
      let relativePathStr = normalizedFilePath.slice(rootPath.length);
      if (relativePathStr.startsWith('/')) {
        relativePathStr = relativePathStr.slice(1);
      }

      // Convert to lowercase for case-insensitive comparison
      const relativePathLower = relativePathStr.toLowerCase();

      // Check if the normalized relative path is in the target paths
      if (normalizedTargetPaths.includes(relativePathLower)) {

        result[relativePathStr] = currentNode.content ?? '';

      }
    } else if (currentNode.type === 'directory' && currentNode.children) {
      for (const child of Object.values(currentNode.children)) {
        traverse(child);
      }
    }
  }

  traverse(node);
  return result;
}
