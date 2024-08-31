import React from 'react'
import ReactDOM from 'react-dom/client'
import {CopyHistoryProvider} from './stateManagement/contexts'
import {ThemeProvider} from 'styled-components'
import {theme} from "./style/theme";
import {BrowserRouter} from 'react-router-dom';
import AppRouter from "./navigation/AppRouter";
import {ToastContainer} from "react-toastify";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CopyHistoryProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <ToastContainer />
            <AppRouter/>
          </BrowserRouter>
        </ThemeProvider>
    </CopyHistoryProvider>
  </React.StrictMode>,
)
