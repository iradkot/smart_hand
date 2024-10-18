// createTestTask/utils/executeCommand.ts

import { exec } from 'child_process';

export interface ExecuteCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function executeCommand(command: string, cwd: string): Promise<ExecuteCommandResult> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      const exitCode = error && typeof error.code === 'number' ? error.code : 0;
      if (error) {
        reject({ stdout, stderr, exitCode });
      } else {
        resolve({ stdout, stderr, exitCode });
      }
    });
  });
}
