import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CopyHistoryProvider } from './contexts/CopyHistoryContext'
import { CopyToClipboardProvider } from './contexts/CopyToClipboardContext'
import { StepManagerProvider } from './contexts/StepManagerContext'
import { ThemeProvider } from 'styled-components'
import { theme } from "./style/theme";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CopyHistoryProvider>
      <StepManagerProvider>
        <CopyToClipboardProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </CopyToClipboardProvider>
      </StepManagerProvider>
    </CopyHistoryProvider>
  </React.StrictMode>,
)
