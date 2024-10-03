// jest-setup.ts
import '@testing-library/jest-dom';
import { IpcRenderer } from 'electron';

// Create a mock for ipcRenderer
const mockIpcRenderer: Partial<IpcRenderer> = {
  invoke: jest.fn(),
  // Mock other methods if needed
};

// Assign the mock to window.electron
Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: mockIpcRenderer,
    // Add other properties or methods if needed
  },
  writable: false,
});
