// utils/testFileNameUtils.ts

import * as path from 'path';

export const generateTestFileName = (originalFileName: string): string => {
  const ext = path.extname(originalFileName);
  const baseName = path.basename(originalFileName, ext);
  const dirName = path.dirname(originalFileName);
  return path.join(dirName, `${baseName}.test${ext}`);
};
