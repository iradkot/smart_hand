import { app, BrowserWindow, dialog, ipcMain, shell, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import axios from 'axios';
import icon from '../../resources/icon.png';
import { FileHandler } from "./fileOperations/utils/FileHandler";
import { COPYING_PROCESS_INVOKE } from "../invokers/constants";
import { UserInterface } from "./fileOperations/utils/UserInterface";
import { IgnoreList } from "./fileOperations/utils/IgnoreList";
import {startCopyingProcess} from "./fileOperations/FileSystemProcessor/StartCopyingProcess";
import {CopyOptions} from "./fileOperations/utils/CopyOptionHandler";

// Constants
const WINDOW_WIDTH = 900;
const WINDOW_HEIGHT = 670;
const DEVELOPMENT_MODE = 'development';
const ELECTRON_RENDERER_URL = 'ELECTRON_RENDERER_URL';
const API_URL = 'http://localhost:5000';
const CHAT_ENDPOINT = '/chat';

// Dependency inversion: abstract API client
interface ApiClient {
  post(url: string, data: any): Promise<any>;
}

class AxiosApiClient implements ApiClient {
  async post(url: string, data: any): Promise<any> {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.log('Error in AxiosApiClient', error);
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: 'Unknown error' };
      }
    }
  }
}

const apiClient: ApiClient = new AxiosApiClient();
const fileHandler = new FileHandler();
const ui = new UserInterface();
const ignoreList = new IgnoreList([
  'node_modules',
  '.git',
  'yarn.lock',
  'package-lock.json',
  '.idea',
  '.vscode',
  'build',
  'out',
  'resources',
]);

function createWindow(): void {
  createAndLoadMainWindow();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: getWebPreferences(),
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  return mainWindow;
}

function getWebPreferences() {
  return {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    webSecurity: true,
    additionalArguments: [`--csp="default-src 'self'; connect-src http://localhost:3000"`],
    nodeIntegration: true,
    contextIsolation: false,
  };
}

function loadWindow(mainWindow: BrowserWindow) {
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (process.env.NODE_ENV === DEVELOPMENT_MODE && process.env[ELECTRON_RENDERER_URL]) {
    mainWindow.loadURL(process.env[ELECTRON_RENDERER_URL]);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createAndLoadMainWindow() {
  const mainWindow = createMainWindow();
  loadWindow(mainWindow);
  return mainWindow;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('open-file-dialog', async (): Promise<string[]> => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections'],
  });
  return result.filePaths;
});

ipcMain.handle(COPYING_PROCESS_INVOKE, async (_: IpcMainInvokeEvent, directoryPath: string, option: string) => {
  try {
    const content = await startCopyingProcess(directoryPath, option as CopyOptions, fileHandler, ui, ignoreList);
    console.log('qweqeq filesAndFolders keys:', Object.keys(content));
    const message = content.fileContents ? `Processed ${content.fileContents.length} files/folders` : 'Processed 0 files/folders';
    return { message, content };
  } catch (err) {
    console.error('Failed to process:', err);
    return handleProcessingError(err);
  }
});

ipcMain.handle('chat-with-gpt', async (_: IpcMainInvokeEvent, messages: any) => {
  return await apiClient.post(`${API_URL}${CHAT_ENDPOINT}`, { messages });
});

function handleProcessingError(err: unknown) {
  if (err instanceof Error) {
    return { error: 'Error during processing', details: err.message };
  } else {
    return { error: 'Unknown error during processing', details: String(err) };
  }
}
