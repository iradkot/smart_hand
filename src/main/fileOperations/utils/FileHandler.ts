import fs from 'fs';
import { IFileHandler } from '../types/interfaces';
import { FileError, DirectoryError } from '../types/Errors';

/**
 * Utility function to handle errors and throw the appropriate custom error.
 * @param error - The caught error, which might be of unknown type.
 * @param filePath - The path related to the operation (file or directory).
 * @param isDirectory - Whether the error occurred in a directory operation.
 */
function handleError(error: unknown, filePath: string, isDirectory: boolean = false): never {
  if (error instanceof Error) {
    if (isDirectory) {
      throw new DirectoryError(`Error reading directory "${filePath}": ${error.message}`);
    } else {
      throw new FileError(`Error reading file "${filePath}": ${error.message}`);
    }
  } else {
    throw new Error(`Unexpected error occurred with "${filePath}": ${String(error)}`);
  }
}

export class FileHandler implements IFileHandler {
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      handleError(error, filePath);
    }
  }

  async readDir(directoryPath: string): Promise<string[]> {
    try {
      return await fs.promises.readdir(directoryPath);
    } catch (error) {
      handleError(error, directoryPath, true);
    }
  }

  async stat(itemPath: string): Promise<fs.Stats> {
    try {
      return await fs.promises.stat(itemPath);
    } catch (error) {
      handleError(error, itemPath);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.promises.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      handleError(error, filePath);
    }
  }
}
