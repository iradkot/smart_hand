import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron'
import {join} from 'path'
import axios from 'axios'
import icon from '../../resources/icon.png?asset'
import Copier from '../main/fileOperations/Copier'
import { FileHandler } from "./fileOperations/utils/FileHandler";
import { COPYING_PROCESS_INVOKE } from "../constants";


// Constants
const WINDOW_WIDTH = 900
const WINDOW_HEIGHT = 670
const DEVELOPMENT_MODE = 'development'
const ELECTRON_RENDERER_URL = 'ELECTRON_RENDERER_URL'
const API_URL = 'http://localhost:5000';
const CHAT_ENDPOINT = '/chat';


// Dependency inversion: abstract API client
interface ApiClient {
  post(url: string, data: any): Promise<any>
}

class AxiosApiClient implements ApiClient {
  async post(url: string, data: any): Promise<any> {
    try {
      const response = await axios.post(url, data)
      return response.data
    } catch (error) {
      return {error: error.message}
    }
  }
}

const apiClient: ApiClient = new AxiosApiClient()
const copier = new Copier(new FileHandler())

function createWindow(): void {
  createAndLoadMainWindow()
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

function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {icon} : {}),
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
  }
}

function loadWindow(mainWindow: BrowserWindow) {
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {action: 'deny'}
  })

  if (process.env.NODE_ENV === DEVELOPMENT_MODE && process.env[ELECTRON_RENDERER_URL]) {
    mainWindow.loadURL(process.env[ELECTRON_RENDERER_URL])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createAndLoadMainWindow() {
  const mainWindow = createMainWindow()
  loadWindow(mainWindow)
  return mainWindow
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections'],
  })
  return result.filePaths
})

ipcMain.handle(COPYING_PROCESS_INVOKE, async (_, directoryPath, option) => {
  try {
    console.log('Copying process started', directoryPath, option);
    const content = await copier.startCopyingProcess(directoryPath, option)
    const message = `Copied ${content.length} files to clipboard`
    return { message, content }
  } catch (err) {
    console.error('3Failed to copy:', err)
    return 'Error during copying'
  }
})

ipcMain.handle('chat-with-gpt', async (_, messages) => {
  return await apiClient.post(`${API_URL}${CHAT_ENDPOINT}`, {messages})
})
