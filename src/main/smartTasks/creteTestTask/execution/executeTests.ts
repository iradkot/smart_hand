// createTestTask/execution/executeTests.ts

import { executeCommand } from '../utils/executeCommand';
import { TestResult } from '../types';
import {CommandError} from "../../../utils/commandRunner";

export async function executeTests(
  packageManager: string,
  projectPath: string,
  testFilePath: string
): Promise<TestResult> {
  const command = `${packageManager} test --runTestsByPath ${testFilePath}`;

  try {
    console.log('Executing tests:', command);
    console.log('projectPath:', projectPath);
    const { stdout, stderr } = await executeCommand(command, projectPath);
    if (stdout) {
      console.log('Tests executed successfully:', stdout);
    }
    if (stderr) {
      console.log('Error executing tests  - stderr:', stderr);
      return { success: false, errorMessage: stderr };
    }
    return { success: true };
  } catch (error) {
    const commandError = error as CommandError;

    console.log('Error executing tests:', error);
    // @ts-ignore
    return { success: false, errorMessage: commandError.stderr || commandError.message || commandError.stdout || 'Unknown error' };
  }
}
