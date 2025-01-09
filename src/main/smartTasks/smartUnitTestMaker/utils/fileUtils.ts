// utils/fileUtils.ts

import * as fs from 'fs'

import * as path from 'path'

export const readFile = async (directoryPath: string, filePath: string): Promise<string> => {
  const absolutePath = path.resolve(directoryPath, filePath)
  return await fs.promises.readFile(absolutePath, 'utf-8')
}

export const writeFile = async (directoryPath: string, filePath: string, content: string): Promise<void> => {
  const absolutePath = path.resolve(directoryPath, filePath)
  await fs.promises.writeFile(absolutePath, content, 'utf-8')
}

export const detectPackageManager = (projectPath: string): string => {
  // Simple detection logic
  if (fs.existsSync(path.resolve(projectPath, 'yarn.lock'))) {
    return 'yarn'
  }
  return 'npm'
}
