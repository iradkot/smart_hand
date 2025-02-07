// utils/executionUtils.ts

import { exec } from 'child_process';
import { TestResult } from '../types';
const stripAnsi = require('strip-ansi');
import * as path from 'path';
import { promises as fs } from 'fs';

/**
 * Actually run the test.
 * We'll assume the user has some test runner set up (Jest, etc.).
 * If a test fails, we parse the output or read a results file, etc.
 */
export function executeTest(
  packageManager: string,
  directoryPath: string,
  testFileName: string
): Promise<TestResult> {
  return new Promise((resolve) => {
    const command = buildTestCommand(packageManager, testFileName);
    exec(command, { cwd: directoryPath }, async (error, _stdout, stderr) => {
      if (error) {
        // Try reading jest-results.json if you have that set up
        const resultsPath = path.join(directoryPath, 'jest-results.json');
        try {
          const resultsContent = await fs.readFile(resultsPath, 'utf-8');
          const results = JSON.parse(resultsContent);

          // You can parse the results here for more detail
          const errorMessage = JSON.stringify(results, null, 2);
          resolve({
            success: false,
            errorMessage,
            details: results,
          });
        } catch (readError) {
          // fallback: parse stderr
          const cleanedStderr = stripAnsi(stderr);
          resolve({
            success: false,
            errorMessage: cleanedStderr,
          });
        }
      } else {
        resolve({ success: true });
      }
    });
  });
}

function buildTestCommand(packageManager: string, testFileName: string): string {
  // Adjust as needed for your test runner
  const testCommand = packageManager === 'yarn' ? 'yarn test' : 'npm test';
  // If using Jest, we could do:
  // return `${testCommand} -- ${testFileName} --json --outputFile=jest-results.json`;
  // But for general usage, let's keep it simple:
  return `${testCommand} -- ${testFileName}`;
}
