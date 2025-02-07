// utils/fileUtils.ts

import * as fs from 'fs';
import * as path from 'path';
import { ImportEntry } from '../types';

/** Read file content as string */
export async function readFileContent(
  directoryPath: string,
  fileName: string
): Promise<string> {
  const absolutePath = path.resolve(directoryPath, fileName);
  return fs.promises.readFile(absolutePath, 'utf-8');
}

/** Write file content */
export async function writeFileContent(
  directoryPath: string,
  fileName: string,
  content: string
): Promise<void> {
  const absolutePath = path.resolve(directoryPath, fileName);
  await fs.promises.writeFile(absolutePath, content, 'utf-8');
}

/** Generate a .test. extension (js or ts) next to the file */
export function generateTestFileName(originalFileName: string): string {
  const ext = path.extname(originalFileName);
  const baseName = path.basename(originalFileName, ext);
  const dirName = path.dirname(originalFileName);
  return path.join(dirName, `${baseName}.test${ext}`);
}

/**
 * Very naive function to parse imports.
 * TODO: Replace with a real parser (like @babel/parser or TypeScript compiler).
 */
export async function readFileImports(directoryPath: string, fileName: string): Promise<ImportEntry[]> {
  const content = await readFileContent(directoryPath, fileName);

  const importRegex = /import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const imports: ImportEntry[] = [];

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      source: match[1],
      raw: match[0],
    });
  }

  return imports;
}
