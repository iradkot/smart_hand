// src/renderer/src/electron.d.ts (or another appropriate location)
import { IpcRenderer } from 'electron'; // Import the existing Electron types

declare global {
  interface Window {
    electron: {
      ipcRenderer: IpcRenderer;
    };
  }
}

export {};