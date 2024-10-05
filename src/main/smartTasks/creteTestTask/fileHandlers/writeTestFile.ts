// createTestTask/fileHandlers/writeTestFile.ts

import { promises as fs } from 'fs';
import path from 'path';

export async function writeTestFile(directoryPath: string, fileName: string, content: string): Promise<void> {
  const filePath = path.join(directoryPath, fileName);
  await fs.writeFile(filePath, content);
}
