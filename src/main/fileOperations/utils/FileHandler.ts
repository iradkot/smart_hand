import fs from 'fs'

export class FileHandler {
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(filePath, 'utf-8')
    } catch (error) {
      const errorMessage = `Error reading file "${filePath}": ${error.message}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async readDir(directoryPath: string): Promise<string[]> {
    try {
      return await fs.promises.readdir(directoryPath)
    } catch (error) {
      const errorMessage = `Error reading directory "${directoryPath}": ${error.message}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async stat(itemPath: string): Promise<fs.Stats> {
    if (!fs.promises || typeof fs.promises.stat !== 'function') {
      throw new Error('fs.promises.stat is not a recognized function.');
    }

    try {
      return await fs.promises.stat(itemPath);
    } catch (error) {
      console.error(`Error fetching stats for item ${itemPath}:`, error);
      throw error;
    }
  }

}
