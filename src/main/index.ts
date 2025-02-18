import 'source-map-support/register'

import { app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent, shell, WebPreferences } from 'electron'
import path, { join } from 'path'
// @ts-ignore
import icon from '../../resources/the_smart_hand_icon.png'
import { FileHandler } from './fileOperations/utils/FileHandler'
import {
  COPYING_PROCESS_INVOKE,
  CREATE_AND_RUN_TEST_INVOKE,
  GET_FILE_IMPORTS_INVOKE,
  READ_PACKAGE_JSON_INVOKE,
} from '../invokers/constants'
import { UserInterface } from './fileOperations/utils/UserInterface'
import { parseImportsWithTsconfig } from './utils/parseImports'
import { CopyingProcessArgs, ErrorResult, PackageJsonReadResult, TestCreationArgs } from './interfaces'
import countNestedValues from '../utils/countNestedValues'
import findPackageJson from './utils/findPackageJson'
import { handleError } from '../utils/ErrorHandler'
import { IgnoreAndAllowList } from './fileOperations/utils/IgnoreAndAllowList'
import { harvestPath } from './fileOperations/FileSystemHarvester/HarvestPath'
import { CopyOptions } from './fileOperations/types/interfaces'
import { ContentNode } from '../types/pathHarvester.types'
// import {createAndRunTest} from "./smartTasks/createTestTask/createAndRunTest";
import { smartUnitTestMaker } from 'src/main/smartTasks/smartUnitTestMaker'


import { inspector } from './inspector'
import { findProjectRootInContentTree } from 'src/main/utils/findProjectRootInContentTree'
import { parseTsconfig } from 'src/main/utils/parseTsconfig'
import { setMainWindow } from 'src/main/mainWindow' // Import the singleton inspector

// Start the inspector
inspector.start?.()

interface ExtendedWebPreferences extends WebPreferences {
  nativeWindowOpen?: boolean;
}

// Constants
const WINDOW_WIDTH = 900
const WINDOW_HEIGHT = 670
const DEVELOPMENT_MODE = 'development'
const ELECTRON_RENDERER_URL = 'ELECTRON_RENDERER_URL'

const fileHandler = new FileHandler()
const ui = new UserInterface()
const ignoreAndAllowList = new IgnoreAndAllowList()

function createWindow(): void {
  createAndLoadMainWindow()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.commandLine.appendSwitch('disable-gpu')

function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: getWebPreferences(),
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  return mainWindow
}

function getWebPreferences() {
  return {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    webSecurity: true,
    additionalArguments: [`--csp="default-src 'self'; connect-src http://localhost:3000"`],
    nodeIntegration: true,
    contextIsolation: false,
    nativeWindowOpen: true,
  }
}

function loadWindow(mainWindow: BrowserWindow) {
  mainWindow.webContents.setWindowOpenHandler((details) => {
    if (details.url.includes('stately.ai')) { // Allow inspector URLs
      const inspectorWindow = new BrowserWindow({
        webPreferences: { nativeWindowOpen: true } as ExtendedWebPreferences,
      })
      inspectorWindow.loadURL(details.url)
      return { action: 'deny' }
    }

    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env.NODE_ENV === DEVELOPMENT_MODE && process.env[ELECTRON_RENDERER_URL]) {
    mainWindow.loadURL(process.env[ELECTRON_RENDERER_URL])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}


function createAndLoadMainWindow() {
  const mainWindow = createMainWindow()
  setMainWindow(mainWindow)
  loadWindow(mainWindow)
  return mainWindow
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-file-dialog', async (): Promise<string[]> => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections'],
  })
  return result.filePaths
})

ipcMain.handle(COPYING_PROCESS_INVOKE, async (_: IpcMainInvokeEvent, directoryPath: string, option: string): Promise<CopyingProcessArgs | ErrorResult> => {
  try {
    const content = await harvestPath(directoryPath, option as CopyOptions, fileHandler, ui, ignoreAndAllowList)

    const message = content.contentTree ? `Processed ${countNestedValues(content.contentTree, 'directory')} directories and ${countNestedValues(content.contentTree, 'file')} files` : 'No content to process'
    return { message, content }
  } catch (err) {
    console.error('Failed to process:', err)
    return handleProcessingError(err)
  }
})

ipcMain.handle(CREATE_AND_RUN_TEST_INVOKE, async (_: IpcMainInvokeEvent, sessionId: string, directoryPath: string, fileContent: string, fileName: string, contentTree: ContentNode, packageJsonPath: string, packageJsonContent: string): Promise<TestCreationArgs> => {
  try {
    // await createAndRunTest(sessionId, directoryPath, fileContent, fileName, packageJsonPath, contentTree, packageJsonContent);
    await smartUnitTestMaker(
      {
        sessionId,
        directoryPath,
        fileContent,
        fileName,
        packageJsonPath,
        contentTree,
        packageJsonContent,
      })
    return { success: true }
  } catch (error) {
    const errorMessage = handleError(error, 'createAndRunTest')
    return { success: false, error: errorMessage }
  }
})

ipcMain.handle(READ_PACKAGE_JSON_INVOKE, async (_: IpcMainInvokeEvent, directoryPath: string): Promise<PackageJsonReadResult | ErrorResult | null> => {
  try {
    // Search for package.json in up to 7 parent directories
    const packageJsonPath = findPackageJson(directoryPath)

    if (packageJsonPath) {
      const usePackageJson = await dialog.showMessageBox({
        message: `Found package.json at ${packageJsonPath}. Do you want to use it?`,
        buttons: ['Yes', 'No'],
        defaultId: 0, // "Yes" is the default
        cancelId: 1,
      })

      if (usePackageJson.response === 0) { // User chose "Yes"
        const content = await fileHandler.readFile(packageJsonPath)
        return { content, packageJsonPath }
      }
    }

    // If no package.json was found, or user chose "No", open file dialog
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      defaultPath: directoryPath,
      filters: [{ name: 'JSON Files', extensions: ['json'] }], // Restrict to JSON files
    })

    const content = result.filePaths.length > 0 ? await fileHandler.readFile(result.filePaths[0]) : null
    return content ? { content, packageJsonPath: result.filePaths[0] } : null
  } catch (error) {
    console.error('Failed to read package.json:', error)
    return handleProcessingError(error)
  }
})

ipcMain.handle(
  GET_FILE_IMPORTS_INVOKE,
  async (_evt, filePath: string, contentTree: ContentNode) => {
    try {
      const projectRoot = findProjectRootInContentTree(contentTree)
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json')
      const tsconfig = parseTsconfig(tsconfigPath) // { baseUrl, paths }
      const imports = parseImportsWithTsconfig(
        filePath,
        projectRoot,
        tsconfig,
      )
      return { success: true, imports }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  })


function handleProcessingError(err: unknown) {
  if (err instanceof Error) {
    return { error: 'Error during processing', details: err.message }
  } else {
    return { error: 'Unknown error during processing', details: String(err) }
  }
}
