// createTestTask/fileHandlers/writePromptFile.ts

import { promises as fs } from 'fs';
import path from 'path';

export async function writePromptFile(directoryPath: string, fileName: string, content: string): Promise<void> {
  const filePath = path.join(directoryPath, fileName);
  await fs.writeFile(filePath, content);
}
