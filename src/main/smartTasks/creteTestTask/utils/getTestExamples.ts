import { promises as fs } from 'fs';
import path from 'path';
import {handleError} from "../../../../utils/ErrorHandler";

const isDevelopment = process.env.NODE_ENV === 'development';  // Check if running in development mode

/**
 * Recursively fetches all test files from the examples folder that match the *.test.* pattern.
 * Adjusts paths based on whether the app is running in development or production mode.
 * @returns {Promise<string>} Concatenated content of all test files.
 */
export async function getTestExamples(): Promise<string> {
  const examplesDir = isDevelopment
    ? path.resolve(__dirname, '../../src/exampleTest')  // Points to src folder in dev
    : path.resolve(process.resourcesPath, 'examples');  // Adjust for production (you can fine-tune the path based on how files are bundled)

  // Recursively collects all files from a directory
  async function collectTestFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return collectTestFiles(res);
      } else if (res.match(/\.test\.[jt]sx?$/)) {
        return [res];
      } else {
        return [];
      }
    }));
    return Array.prototype.concat(...files);
  }

  try {
    // Collect all test files recursively from the examples directory
    const testFiles = await collectTestFiles(examplesDir);

    // Read and concatenate the content of all test files
    const testExamples = await Promise.all(
      testFiles.map(async (testFile) => {
        return await fs.readFile(testFile, 'utf-8');
      })
    );

    return testExamples.join('\n\n');
  } catch (error) {
    throw handleError(error, 'getTestExamples');
  }
}
