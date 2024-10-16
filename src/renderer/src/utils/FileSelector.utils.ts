import { ContentNode } from '../../../types/pathHarvester.types';

/**
 * Extracts the file or folder name from a given path.
 * @param filePath The full path of the file or folder.
 * @returns The name of the file or folder.
 */
export const getNameFromPath = (filePath: string): string => {
  const parts = filePath.split(/[/\\]+/).filter(Boolean);
  return parts.pop() || '';
};

/**
 * Sorts ContentNode entries, placing directories before files.
 * @param a The first ContentNode.
 * @param b The second ContentNode.
 * @returns -1 if a should come before b, 1 if after, 0 if equal.
 */
export const sortContentNodes = (a: ContentNode, b: ContentNode): number => {
  if (a.type === b.type) {
    // If same type, sort alphabetically
    return getNameFromPath(a.localPath).localeCompare(getNameFromPath(b.localPath));
  } else if (a.type === 'directory') {
    // Directories come before files
    return -1;
  } else {
    return 1;
  }
};
