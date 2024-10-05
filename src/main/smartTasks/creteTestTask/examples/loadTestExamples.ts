// createTestTask/examples/loadTestExamples.ts

import { promises as fs } from 'fs';
import path from 'path';
import {handleError} from "../../../../utils/ErrorHandler";

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
          return [res];
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
    throw handleError(error, 'loadTestExamples');
  }
}
