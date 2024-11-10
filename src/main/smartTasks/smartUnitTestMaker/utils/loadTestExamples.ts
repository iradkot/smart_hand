// createTestTask/examples/loadTestExamples.ts

import { promises as fs } from 'fs';
import path from 'path';
import {handleError} from 'src/utils/ErrorHandler';

/**
 * This function is responsible for loading the test examples which are used by the prompt.
 */
export async function loadTestExamples(): Promise<string> {
  const examplesDir = path.resolve(__dirname, '../../src/exampleTest');

  async function collectTestFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const res = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
          return collectTestFiles(res);
        } else if (res.match(/\.test\.[jt]sx?$/)) {
          try {
            await fs.readFile(res, 'utf-8'); // Attempt to read the file
            return [res];
          } catch (err) {
            console.error(`Failed to read file ${res}:`, err);
            return []; // Skip files that fail to read
          }
        } else {
          return [];
        }
      })
    );
    return files.flat();
  }

  try {
    const testFiles = await collectTestFiles(examplesDir);
    const testExamples = await Promise.all(testFiles.map((file) => fs.readFile(file, 'utf-8')));
    return testExamples.join('\n\n');
  } catch (error) {
    const errorMsg = handleError(error, 'loadTestExamples');
    throw new Error(errorMsg);  }
}
