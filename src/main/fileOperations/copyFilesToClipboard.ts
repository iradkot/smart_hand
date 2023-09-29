import fs from 'fs'
import path from 'path'
import { dialog, clipboard } from 'electron'

const ignoreList = ['node_modules', '.git', 'yarn.lock', 'package-lock.json']

class Copier {
  folderStructure = []
  ignoredFiles = []

  async ask(question: string, path: string): Promise<boolean> {
    console.log(`Asking question: "${question}" for path: "${path}"`)
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: `Do you want to copy the contents of the folder "${path}"?`
    })
    console.log(`User response: ${result.response}`)
    return result.response === 0
  }

  async processItem(dirPath: string, item: string, basePath: string, fileEntries: string[], option: string) {
    const itemPath = path.join(dirPath, item)
    const relativeItemPath = path.relative(basePath, itemPath)
    const itemStat = await fs.promises.stat(itemPath)

    console.log(`Processing item: "${item}" (full path: "${itemPath}")`)

    if (ignoreList.includes(item)) return this.addToIgnore(itemStat, relativeItemPath)

    if (itemStat.isFile()) {
      this.folderStructure.push(`${relativeItemPath}\n`)
      return option === '1' && this.readFile(itemPath, relativeItemPath, fileEntries)
    }

    if (itemStat.isDirectory()) {
      const answer = await this.ask(`Do you want to copy the contents of the folder?`, relativeItemPath)
      if (answer) {
        return await this.copyFilesToClipboard(basePath, itemPath, fileEntries, option)
      }
      return this.folderStructure.push(`${relativeItemPath}\n`)
    }
  }

  addToIgnore(itemStat: fs.Stats, itemPath: string) {
    if (itemStat.isFile()) {
      this.ignoredFiles.push(`${itemPath}\n`)
    } else if(itemStat.isDirectory()) {
      this.folderStructure.push(`${itemPath}\n`)
    }
  }

  async readFile(itemPath: string, relativeItemPath: string, fileEntries: string[]) {
    const fileContent = await fs.promises.readFile(itemPath, 'utf-8')
    fileEntries.push(`${relativeItemPath}\n${fileContent}\n`)
  }

  async copyFilesToClipboard(basePath: string, directoryPath = basePath, fileEntries = [], option: string)
    : Promise<string[]> {
    console.log(`Reading directory: "${directoryPath}"`)
    const items = await fs.promises.readdir(directoryPath)

    for (const item of items) {
      await this.processItem(directoryPath, item, basePath, fileEntries, option)
    }
    return fileEntries
  }

  async startCopyingProcess(directoryPath: string, option: string): Promise<string> {
    console.log('2 Starting copying process')

    const initialStat = await fs.promises.stat(directoryPath)

    if (initialStat.isFile()) return this.processFile(directoryPath, option)

    // Reset for folders
    this.folderStructure = []
    this.ignoredFiles = []

    const fileEntries = await this.copyFilesToClipboard(directoryPath, directoryPath, [], option)
    return this.writeToClipboard(directoryPath, fileEntries, option)
  }

  async processFile(directoryPath: string, option: string) {
    const fileContent = await fs.promises.readFile(directoryPath, 'utf-8')
    const clipboardContent = this.getClipboardContentForFile(directoryPath, fileContent, option)

    console.log('Copying data to clipboard')
    clipboard.writeText(clipboardContent)

    console.log('Data copied to clipboard successfully')
    return 'Data copied to clipboard successfully'
  }

  getClipboardContentForFile(directoryPath: string, fileContent: string, option: string): string {
    switch (option) {
      case '1':
        return [
          `The following is the content of the file "${directoryPath}":\n\n`,
          fileContent
        ].join('')
      case '2':
        return `The path of the file is: "${directoryPath}"`
      default:
        console.error('Invalid option provided')
        return 'Invalid option'
    }
  }

  writeToClipboard(directoryPath: string, fileEntries: string[], option: string): { message: string; content: string; } {
    const clipboardContent = this.getClipboardContentForFolder(directoryPath, fileEntries, option)

    console.log('Copying data to clipboard')
    clipboard.writeText(clipboardContent)

    console.log('Data copied to clipboard successfully')
    return { message: 'Data copied to clipboard successfully', content: clipboardContent }
  }

  getClipboardContentForFolder(directoryPath: string, fileEntries: string[], option: string): string {
    switch (option) {
      case '1':
        return [
          `The following is the structure of the folder "${directoryPath}":\n`,
          ...this.folderStructure,
          '\nThe following are the ignored files and folders:\n',
          ...this.ignoredFiles,
          '\nThe following is the content of files with their paths relative to the base folder:\n',
          ...fileEntries
        ].join('\n')
      case '2':
        return [
          `The following is the structure of the folder "${directoryPath}":\n`,
          ...this.folderStructure,
          '\nThe following are the ignored files and folders:\n',
          ...this.ignoredFiles
        ].join('\n')
      default:
        console.error('Invalid option provided')
        return 'Invalid option'
    }
  }
}

export default new Copier()
