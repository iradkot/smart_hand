import { exec } from 'child_process';

export class CommandExecutor {
  async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${stderr}`);
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
