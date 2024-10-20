// testRunner/testResultParser.ts

import { TestResult } from '../types/testResult.types';
import { promises as fs } from 'fs';
import path from 'path';

export async function parseTestResults(
  projectPath: string,
  stderr: string,
  exitCode: number
): Promise<TestResult> {
  const jestResultsPath = path.join(projectPath, 'jest-results.json');

  let jestResults;
  try {
    const jestResultsContent = await fs.readFile(jestResultsPath, 'utf-8');
    jestResults = JSON.parse(jestResultsContent);
  } catch (error) {
    return {
      success: false,
      errorMessage: 'Failed to parse Jest results',
      // Store warnings separately if needed
      warnings: stderr ? stderr.split('\n').filter(line => line.trim() !== '') : [],
    };
  } finally {
    await fs.unlink(jestResultsPath).catch(() => {});
  }

  // Extract relevant test failures
  const testResults = jestResults.testResults.map((result: any) => {
    const failedAssertions = result.assertionResults.filter((assertion: any) => assertion.status === 'failed');
    return {
      testFilePath: result.name,
      status: result.status,
      assertionResults: failedAssertions.map((assertion: any) => ({
        title: assertion.title,
        failureMessages: assertion.failureMessages,
      })),
    };
  });

  return {
    success: exitCode === 0,
    summary: {
      numPassedTests: jestResults.numPassedTests,
      numFailedTests: jestResults.numFailedTests,
      numPendingTests: jestResults.numPendingTests,
      numTotalTests: jestResults.numTotalTests,
    },
    testResults,
    // Optionally include stderr as warnings or discard
    warnings: [], // Empty if you choose not to display warnings
  };
}
