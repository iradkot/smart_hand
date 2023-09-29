import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { join } from 'path'
import axios from 'axios'
import icon from '../../resources/icon.png?asset'
import startCopyingProcess from './fileOperations/copyFilesToClipboard'

function createWindow(): void {
  // Create and load main window
  const mainWindow1 = createAndLoadMainWindow()
  const mainWindow2 = createAndLoadMainWindow()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

function createAndLoadMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: getWebPreferences(),
  })

  loadMainWindow(mainWindow)

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

function loadMainWindow(mainWindow: BrowserWindow) {
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env.NODE_ENV === 'development' && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
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

ipcMain.handle('invoke-copying-process', async (_, directoryPath, option) => {
  try {
    const result = await startCopyingProcess(directoryPath, option)
    return result
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return 'Error copying to clipboard'
  }
})

ipcMain.handle('chat-with-gpt', async (_, messages) => {
  try {
    const response = await axios.post('http://localhost:3000/chat', { messages }) // Replace with your server URL
    return response.data
  } catch (error) {
    return { error: error.message }
  }
})
