// flows/testExecutionFlow.ts
import { executeTest } from '../utils/executionUtils';
import { TestResult } from '../types';

export async function testExecutionFlow(params: {
  packageManager: string;
  directoryPath: string;
  testFileName: string;
}): Promise<TestResult> {
  const { packageManager, directoryPath, testFileName } = params;
  return await executeTest(packageManager, directoryPath, testFileName);
}
