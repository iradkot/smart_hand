import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {CopyHistoryProvider} from './contexts/CopyHistoryContext'
import {CopyToClipboardProvider} from './contexts/CopyToClipboardContext'
import {StepManagerProvider} from './contexts/StepManagerContext'
import {ThemeProvider} from 'styled-components'
import {theme} from "./style/theme";
import '../../utils/errorHandling';
import {BrowserRouter} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CopyHistoryProvider>
      <StepManagerProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CopyToClipboardProvider>
              <App/>
            </CopyToClipboardProvider>
          </BrowserRouter>
        </ThemeProvider>
      </StepManagerProvider>
    </CopyHistoryProvider>
  </React.StrictMode>,
)
