/**
 * Represents the hierarchical structure of directories and files.
 * The key is the name of the directory or file, and the value is the associated content.
 */
export type contentTree = Record<string, ContentNode>;
/**
 * Represents an entry in the contentTree, which can be either a file or a directory.
 *
 * @property {'file' | 'directory'} type - Indicates whether the node is a file or a directory.
 * @property {string | null} [content] - The content of the file (only if it's a file).
 * @property {contentTree} [children] - Nested directories and files (only if it's a directory).
 */
export type ContentNode = {
  type: 'file' | 'directory';
  content?: string | null;
  children?: contentTree;
  localPath: string;
};


export type copiedContent = {
  folderStructure: string;
  ignoredFiles: string;
  contentTree?: ContentNode;
};
