import { useMemo } from 'react';
import { ContentNode } from 'src/types/pathHarvester.types';

export function useNodeMap(contentTree: ContentNode) {
  /*
    * Build a map for quick lookups of nodes by localPath
    * @param contentTree The root of the content tree.
    * @returns A map of local paths to ContentNode objects.
   */
  return useMemo(() => {
    const map = new Map<string, ContentNode>();

    const buildMap = (node: ContentNode) => {
      map.set(node.localPath, node);
      if (node.children) {
        Object.values(node.children).forEach(buildMap);
      }
    };

    buildMap(contentTree);
    return map;
  }, [contentTree]);
}
