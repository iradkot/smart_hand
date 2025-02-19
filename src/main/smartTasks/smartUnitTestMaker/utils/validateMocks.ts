// src/main/smartTasks/smartUnitTestMaker/utils/validateMocks.ts
import { exec } from 'child_process';

/**
 * Validates a TypeScript file by compiling it using tsc in --noEmit mode.
 * This is used to catch type conversion errors, such as those that might occur in generated mocks.
 * 
 * @param filePath - The absolute path to the file to validate.
 * @returns A promise that resolves if the file passes type-check, or rejects with an error message otherwise.
 */
export function validateFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`tsc --noEmit "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr || stdout || 'Type-check failed.'));
      }
      resolve();
    });
  });
}
