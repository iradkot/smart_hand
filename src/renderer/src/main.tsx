import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {CopyHistoryProvider} from './contexts/CopyHistoryContext'
import {ThemeProvider} from 'styled-components'
import {theme} from "./style/theme";
import '../../utils/errorHandling';
import {BrowserRouter} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CopyHistoryProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
              <App/>
          </BrowserRouter>
        </ThemeProvider>
    </CopyHistoryProvider>
  </React.StrictMode>,
)
