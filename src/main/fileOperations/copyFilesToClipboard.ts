import fs from 'fs'
import path from 'path'
import { dialog, clipboard } from 'electron'

const ignoreList = ['node_modules', '.git', 'yarn.lock', 'package-lock.json']

let folderStructure = []
let ignoredFiles = []

async function ask(question: string, path: string): Promise<boolean> {
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

async function copyFilesToClipboard(
  basePath: string,
  directoryPath = basePath,
  fileEntries = [],
  option: string
): Promise<string[]> {
  if (directoryPath === basePath) {
    const itemStat = await fs.promises.stat(directoryPath)

    if (itemStat.isFile()) {
      const fileContent = await fs.promises.readFile(directoryPath, 'utf-8')
      return [`${directoryPath}\n${fileContent}\n`]
    }
  }

  console.log(`Reading directory: "${directoryPath}"`)
  const items = await fs.promises.readdir(directoryPath)

  for (const item of items) {
    const itemPath = path.join(directoryPath, item)
    const relativeItemPath = path.relative(basePath, itemPath)
    const itemStat = await fs.promises.stat(itemPath)

    console.log(`Processing item: "${item}" (full path: "${itemPath}")`)

    if (ignoreList.includes(item)) {
      if (itemStat.isFile()) {
        ignoredFiles.push(`${relativeItemPath}\n`)
      } else if (itemStat.isDirectory()) {
        folderStructure.push(`${relativeItemPath}\n`)
      }
      continue
    }

    if (itemStat.isFile()) {
      folderStructure.push(`${relativeItemPath}\n`)
      if (option === '1') {
        const fileContent = await fs.promises.readFile(itemPath, 'utf-8')
        fileEntries.push(`${relativeItemPath}\n${fileContent}\n`)
      }
    } else if (itemStat.isDirectory()) {
      const answer = await ask(`Do you want to copy the contents of the folder?`, relativeItemPath)
      if (answer) {
        await copyFilesToClipboard(basePath, itemPath, fileEntries, option)
      } else {
        folderStructure.push(`${relativeItemPath}\n`)
      }
    }
  }
  return fileEntries
}

export default async function startCopyingProcess(
  directoryPath: string,
  option: string
): Promise<string> {
  console.log('2 Starting copying process')

  const initialStat = await fs.promises.stat(directoryPath)

  if (initialStat.isFile()) {
    const fileContent = await fs.promises.readFile(directoryPath, 'utf-8')
    let clipboardContent
    switch (option) {
      case '1':
        clipboardContent = [
          `The following is the content of the file "${directoryPath}":\n\n`,
          fileContent
        ].join('')
        break
      case '2':
        clipboardContent = `The path of the file is: "${directoryPath}"`
        break
      default:
        console.error('Invalid option provided')
        return 'Invalid option'
    }

    console.log('Copying data to clipboard')
    clipboard.writeText(clipboardContent)

    console.log('Data copied to clipboard successfully')
    return 'Data copied to clipboard successfully'
  }

  // Reset for folders
  folderStructure = []
  ignoredFiles = []

  const fileEntries = await copyFilesToClipboard(directoryPath, directoryPath, [], option)
  let clipboardContent
  switch (option) {
    case '1':
      clipboardContent = [
        `The following is the structure of the folder "${directoryPath}":\n`,
        ...folderStructure,
        '\nThe following are the ignored files and folders:\n',
        ...ignoredFiles,
        '\nThe following is the content of files with their paths relative to the base folder:\n',
        ...fileEntries
      ].join('\n')
      break
    case '2':
      clipboardContent = [
        `The following is the structure of the folder "${directoryPath}":\n`,
        ...folderStructure,
        '\nThe following are the ignored files and folders:\n',
        ...ignoredFiles
      ].join('\n')
      break
    default:
      console.error('Invalid option provided')
      return 'Invalid option'
  }

  console.log('Copying data to clipboard')
  clipboard.writeText(clipboardContent)

  console.log('Data copied to clipboard successfully')
  return { message: 'Data copied to clipboard successfully', content: clipboardContent }
}
