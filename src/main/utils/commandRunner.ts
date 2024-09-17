// src/main/utils/commandRunner.ts

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec); // Convert exec to a promise-based function

export const runCommand = async (command: string, cwd: string): Promise<void> => {
  try {
    console.log(`Running: ${command}`);
    const { stdout, stderr } = await execAsync(command, { cwd });
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
    }
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    throw error;
  }
};
