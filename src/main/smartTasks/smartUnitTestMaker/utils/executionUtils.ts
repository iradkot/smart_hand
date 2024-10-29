// utils/executionUtils.ts

import { exec } from 'child_process';
import { TestResult } from '../types';
import { promises as fs } from 'fs';
import path from 'path';

export const executeTest = (packageManager: string, projectPath: string, testFilePath: string): Promise<TestResult> => {
  return new Promise((resolve) => {
    const command = buildTestCommand(packageManager, testFilePath);
    exec(command, { cwd: projectPath }, async (error, _stdout, stderr) => {
      if (error) {
        // Read jest-results.json
        const resultsPath = path.join(projectPath, 'jest-results.json');
        try {
          const resultsContent = await fs.readFile(resultsPath, 'utf-8');
          const results = JSON.parse(resultsContent);
          resolve({
            success: false,
            errorMessage: stderr,
            details: results,
          });
        } catch (readError) {
          resolve({
            success: false,
            errorMessage: stderr,
          });
        }
      } else {
        resolve({ success: true });
      }
    });
  });
};

const buildTestCommand = (packageManager: string, testFilePath: string): string => {
  const testCommand = packageManager === 'yarn' ? 'yarn test' : 'npm test';
  return `${testCommand} -- ${testFilePath} --json --outputFile=jest-results.json`;
};
