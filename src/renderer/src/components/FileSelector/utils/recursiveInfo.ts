import { ContentNode } from 'src/types/pathHarvester.types';

export function getRecursiveInfo(node: ContentNode): { totalItems: number; totalChars: number } {
  if (node.type === 'file') {
    // For files: totalItems=1, totalChars = length of the file content
    const fileContent = node.content || '';
    return { totalItems: 1, totalChars: fileContent.length };
  } else {
    // For directories:
    const fileNameLength = node.localPath.length;
    let totalItems = 1;
    let totalChars = fileNameLength;
    if (node.children) {
      for (const child of Object.values(node.children)) {
        const childInfo = getRecursiveInfo(child);
        totalItems += childInfo.totalItems;
        totalChars += childInfo.totalChars;
      }
    }
    return { totalItems, totalChars };
  }
}
