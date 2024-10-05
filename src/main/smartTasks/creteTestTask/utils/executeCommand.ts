// createTestTask/utilities/executeCommand.ts

import { exec } from 'child_process';

export function executeCommand(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ stderr, stdout });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
