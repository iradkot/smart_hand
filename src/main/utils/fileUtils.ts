import { writeFile } from 'fs/promises';
import * as path from 'path';

export async function writeFileContent(directoryPath: string, filePath: string, content: string): Promise<void> {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(directoryPath, filePath);
  await writeFile(fullPath, content, 'utf8');
}
