import { app, BrowserWindow, dialog, ipcMain, shell, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import icon from '../../resources/icon.png';
import { FileHandler } from "./fileOperations/utils/FileHandler";
import {COPYING_PROCESS_INVOKE, CREATE_AND_RUN_TEST_INVOKE} from "../invokers/constants";
import { UserInterface } from "./fileOperations/utils/UserInterface";
import { IgnoreList } from "./fileOperations/utils/IgnoreList";
import {harvestPath} from "./fileOperations/FileSystemHarvester/HarvestPath";
import {createAndRunTest} from "./smartTasks/TestTasks";
import {CopyOptions} from "./fileOperations/types/interfaces";
import {handleError} from "../utils/ErrorHandler";
import countNestedValues from "../utils/countNestedValues";

// Constants
const WINDOW_WIDTH = 900;
const WINDOW_HEIGHT = 670;
const DEVELOPMENT_MODE = 'development';
const ELECTRON_RENDERER_URL = 'ELECTRON_RENDERER_URL';

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
  'dist',
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
    console.log('1')
    const content = await harvestPath(directoryPath, option as CopyOptions, fileHandler, ui, ignoreList);
    console.log('2')

    const message = content.contentTree ? `Processed ${countNestedValues(content.contentTree, 'directory')} directories and ${countNestedValues(content.contentTree, 'file')} files` : 'No content to process';
    console.log({message});
    return { message, content };
  } catch (err) {
    console.error('Failed to process:', err);
    return handleProcessingError(err);
  }
});

ipcMain.handle(CREATE_AND_RUN_TEST_INVOKE, async (_: IpcMainInvokeEvent, sessionId: string, directoryPath: string, fileContent: string, instructions?: string) => {
  try {
    console.log('createAndRunTest:', sessionId, directoryPath, fileContent.length, instructions?.length);
    await createAndRunTest(sessionId, directoryPath, fileContent, instructions);
    return { success: true };
  } catch (error) {
    const errorMessage = handleError(error, 'Error in createAndRunTest');
    return { success: false, error: errorMessage };
  }
});

function handleProcessingError(err: unknown) {
  if (err instanceof Error) {
    return { error: 'Error during processing', details: err.message };
  } else {
    return { error: 'Unknown error during processing', details: String(err) };
  }
}
