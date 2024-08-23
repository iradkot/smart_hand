import fs from 'fs';
import { IFileHandler } from '../types/interfaces';
import { FileError, DirectoryError } from '../types/Errors';

export class FileHandler implements IFileHandler {
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new FileError(`Error reading file "${filePath}": ${error.message}`);
    }
  }

  async readDir(directoryPath: string): Promise<string[]> {
    try {
      return await fs.promises.readdir(directoryPath);
    } catch (error) {
      throw new DirectoryError(`Error reading directory "${directoryPath}": ${error.message}`);
    }
  }

  async stat(itemPath: string): Promise<fs.Stats> {
    try {
      return await fs.promises.stat(itemPath);
    } catch (error) {
      throw new FileError(`Error fetching stats for item "${itemPath}": ${error.message}`);
    }
  }
}
