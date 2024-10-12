// testRunner/executeTests.ts

import { buildTestCommand } from './testCommandBuilder';
import { executeCommand } from '../utils/executeCommand';
import { parseTestResults } from './testResultParser';
import { TestResult } from '../types';
import {handleError} from "../../../../utils/ErrorHandler";

export async function executeTests(
  packageManager: string,
  projectPath: string,
  testFilePath: string
): Promise<TestResult> {
  const command = buildTestCommand(packageManager, testFilePath);

  try {
    console.log('Executing tests:', command);
    console.log('Project Path:', projectPath);

    // @ts-ignore - ignoring that stdout is not used, as it is not needed for now
    const { stdout, stderr, exitCode } = await executeCommand(command, projectPath);

    const testResult = await parseTestResults(projectPath, stderr, exitCode);

    return testResult;
  } catch (error) {
    console.error('Error executing tests:', error);

    return {
      success: false,
      errorMessage: handleError(error, 'executeTests'),
    };
  }
}
