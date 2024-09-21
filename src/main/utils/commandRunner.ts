import { exec, ExecOptions } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from "fs";

const execAsync = promisify(exec);

export const runCommand = async (command: string, executionPath: string): Promise<void> => {
  try {
    // Verify executionPath is a valid directory
    if (!fs.existsSync(executionPath)) {
      throw new Error(`Invalid directory: ${executionPath}`);
    }
    console.log(`Running command in directory: ${executionPath}`);
    console.log(`Command: ${command}`);

    // Determine the appropriate shell based on the platform
    let shell: string | undefined;

    if (process.platform === 'win32') {
      // Use cmd.exe as the default shell for Windows
      shell = 'cmd.exe';
    } else {
      // On Unix-like systems, try to use the user's default shell (if available)
      shell = process.env.SHELL || '/bin/sh'; // Use the default shell or fallback to /bin/sh
    }

    const options: ExecOptions = { cwd: executionPath, shell };

    const { stdout, stderr } = await execAsync(command, options);

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`Command not found: ${command}`);
    } else {
      console.error(`Error executing command: ${command}`, error);
    }
    throw error;
  }
};
