import '@testing-library/jest-dom';
import {ThemeProvider} from 'styled-components'
import { render } from '@testing-library/react';
import theme from "./src/renderer/src/style/theme";

(global as any).window = {
  electron: {
    ipcRenderer: {
      invoke: jest.fn(), // Mock the invoke function used in your tests
    },
  },
};
// Extend the render method to include ThemeProvider
const customRender = (ui: React.ReactElement, options = {}) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, { ...options });

// Export the custom render method to be used in tests
export * from '@testing-library/react'; // Re-export all testing library methods
export { customRender as render }; // Override the render method
