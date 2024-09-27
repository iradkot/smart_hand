import { exec, ExecOptions } from 'child_process';
import { promisify } from 'util';
import fs from "fs";

const execAsync = promisify(exec);

export const runCommand = async (command: string, executionPath: string): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Verify executionPath is a valid directory
    if (!fs.existsSync(executionPath)) {
      throw new Error(`Invalid directory: ${executionPath}`);
    }
    console.log(`Running command in directory: ${executionPath}`);
    console.log(`Command: ${command}`);

    let shell: string | undefined;

    if (process.platform === 'win32') {
      shell = 'cmd.exe';
    } else {
      shell = process.env.SHELL || '/bin/sh';
    }

    const options: ExecOptions = { cwd: executionPath, shell };

    const { stdout, stderr } = await execAsync(command, options);
    return { stdout, stderr };
  } catch (error: any) {
    if (error.stdout || error.stderr) {
      return { stdout: error.stdout || '', stderr: error.stderr || '' };
    } else {
      if (error.code === 'ENOENT') {
        console.error(`Command not found: ${command}`);
      } else {
        console.error(`Error executing command: ${command}`, error);
      }
      throw error;
    }
  }
};
