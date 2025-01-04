// src/main/utils/findProjectRootInContentTree.ts
import { ContentNode } from 'src/types/pathHarvester.types';
import path from 'path';

/**
 * Traverses a ContentNode tree to find either package.json or tsconfig.json.
 * If found, returns the directory that contains it, i.e. the "project root".
 *
 * By default, we look for "package.json" first, else "tsconfig.json".
 * If neither found, we fallback to the top-level node's directory.
 *
 * @param rootNode The root ContentNode from your harvester
 * @returns Absolute path to the project root directory
 */
export function findProjectRootInContentTree(rootNode: ContentNode): string {
  let packageJsonPath: string | null = null;
  let tsconfigPath: string | null = null;

  // BFS or DFS through the tree:
  function traverse(node: ContentNode) {
    if (node.type === 'file') {
      const base = path.basename(node.localPath);
      if (base === 'package.json') {
        packageJsonPath = node.localPath;
      }
      if (base === 'tsconfig.json') {
        tsconfigPath = node.localPath;
      }
    }

    if (node.type === 'directory' && node.children) {
      for (const child of Object.values(node.children)) {
        traverse(child);
      }
    }
  }

  traverse(rootNode);

  // Priority 1: package.json
  if (packageJsonPath) {
    return path.dirname(packageJsonPath);
  }
  // Priority 2: tsconfig.json
  if (tsconfigPath) {
    return path.dirname(tsconfigPath);
  }
  // Fallback: the root node’s localPath is presumably the top-level directory
  return rootNode.type === 'directory'
    ? rootNode.localPath
    : path.dirname(rootNode.localPath);
}
