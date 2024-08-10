import {clipboard, dialog} from 'electron'
import {FileHandler} from './utils/FileHandler'
import * as fs from 'fs'
import * as path from 'path'

enum CopyOptions {
  CopyFileContents = '1',
  OnlyCopyStructure = '2',
}

const ignoreList = ['node_modules', '.git', 'yarn.lock', 'package-lock.json']

export default class Copier {
  folderStructure: string[] = []
  ignoredFiles: string[] = []
  fileHandler: FileHandler

  constructor(fileHandler: FileHandler) {
    this.fileHandler = fileHandler
    this.startCopyingProcess = this.startCopyingProcess.bind(this)
  }

  log(message: string, metadata: Record<string, any> = {}) {
    console.log(`[Copier]: ${message}`, JSON.stringify(metadata))
  }

  async ask(question: string): Promise<boolean> {
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: question,
    })
    return result.response === 0
  }

  async processItem(
    dirPath: string,
    item: string,
    basePath: string,
    fileEntries: string[],
    option: string,
  ) {
    try {
      const itemPath = path.join(dirPath, item)
      const relativeItemPath = path.relative(basePath, itemPath)
      const itemStat = await this.fileHandler.stat(itemPath)

      if (ignoreList.includes(item)) {
        this.addToIgnore(itemStat, relativeItemPath)
      } else if (itemStat.isFile()) {
        this.folderStructure.push(`${relativeItemPath}\n`)
        if (option === CopyOptions.CopyFileContents) {
          await this.readFile(itemPath, relativeItemPath, fileEntries)
        }
      } else if (itemStat.isDirectory()) {
        const answer = await this.ask(
          `Do you want to copy the contents of the folder? ${relativeItemPath}`
        )
        if (answer) {
          await this.copyFilesToClipboard(basePath, itemPath, fileEntries, option)
        } else {
          this.folderStructure.push(`${relativeItemPath}\n`)
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.log(`Error processing item ${item}`, {
          dirPath,
          item,
          basePath,
          error: error.message,
        })
      }
    }
  }

  addToIgnore(itemStat: fs.Stats, itemPath: string) {
    if (itemStat.isFile()) {
      this.ignoredFiles.push(`${itemPath}\n`)
    } else if (itemStat.isDirectory()) {
      this.folderStructure.push(`${itemPath}\n`)
    }
  }

  async readFile(itemPath: string, relativeItemPath: string, fileEntries: string[]) {
    const fileContent = await this.fileHandler.readFile(itemPath)
    fileEntries.push(`${relativeItemPath}\n${fileContent}\n`)
  }

  async copyFilesToClipboard(
    basePath: string,
    directoryPath = basePath,
    fileEntries: string[] = [],
    option: string,
  ): Promise<string[]> {
    try {
      this.log(
        `Copying files to clipboard from directory: "${directoryPath}" with base path: "${basePath}"`,
      )

      const items = await this.fileHandler.readDir(directoryPath)

      for (const item of items) {
        this.log(`Processing item: "${item}" in directory: "${directoryPath}"`)
        await this.processItem(directoryPath, item, basePath, fileEntries, option)
      }

      return fileEntries
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.log('Error during copyFilesToClipboard', {
          directoryPath,
          basePath,
          option,
          error: error.message,
        })
      }
      throw error // Rethrow the error to be caught by caller or a global error handler
    }
  }

  async startCopyingProcess(directoryPath: string, option: string): Promise<string> {
    try {
      this.log(`Starting copy process for directory: "${directoryPath}" with option: "${option}"`)
      const initialStat = await this.fileHandler.stat(directoryPath)

      if (initialStat.isFile()) {
        this.log(`The path "${directoryPath}" is a file. Processing file.`)
        return this.processFile(directoryPath, option)
      }

      this.log(
        `Resetting folder structure and ignored files lists for directory: "${directoryPath}"`,
      )
      this.folderStructure = []
      this.ignoredFiles = []

      const fileEntries = await this.copyFilesToClipboard(directoryPath, directoryPath, [], option)
      return this.writeToClipboard(directoryPath, fileEntries, option)
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.log('Error during startCopyingProcess', { directoryPath, option, error: error.message })
      }
      throw error // Rethrow the error to be caught by caller or a global error handler
    }
  }

  async processFile(directoryPath: string, option: string) {
    const fileContent = await this.fileHandler.readFile(directoryPath)
    const clipboardContent = this.getClipboardContentForFile(directoryPath, fileContent, option)
    clipboard.writeText(clipboardContent)
    return 'Data copied to clipboard successfully'
  }

  getClipboardContentForFile(directoryPath: string, fileContent: string, option: string): string {
    switch (option) {
      case CopyOptions.CopyFileContents:
        return `The following is the content of the file "${directoryPath}":\n\n${fileContent}`
      case CopyOptions.OnlyCopyStructure:
        return `The path of the file is: "${directoryPath}"`
      default:
        console.error('Invalid option provided')
        return 'Invalid option'
    }
  }

  writeToClipboard(directoryPath: string, fileEntries: string[], option: string): string {
    return this.getClipboardContentForFolder(directoryPath, fileEntries, option);
  }

  getClipboardContentForFolder(
    directoryPath: string,
    fileEntries: string[],
    option: string,
  ): string {
    try {
      switch (option) {
        case CopyOptions.CopyFileContents:
          return [
            `The following is the structure of the folder "${directoryPath}":\n`,
            ...this.folderStructure,
            '\nThe following are the ignored files and folders:\n',
            ...this.ignoredFiles,
            '\nThe following is the content of files with their paths relative to the base folder:\n',
            ...fileEntries,
          ].join('')
        case CopyOptions.OnlyCopyStructure:
          return [
            `The following is the structure of the folder "${directoryPath}":\n`,
            ...this.folderStructure,
            '\nThe following are the ignored files and folders:\n',
            ...this.ignoredFiles,
          ].join('')
        default:
          console.error('Invalid option provided', { directoryPath, option })
          return 'Invalid option'
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.log(`Error getting clipboard content for folder ${directoryPath}`, {
          directoryPath,
          option,
          error: error.message,
        })
      }
      return 'Error getting clipboard content'
    }
  }
}
