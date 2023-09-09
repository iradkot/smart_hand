import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {CopyHistoryProvider} from './contexts/CopyHistoryContext'
import {CopyToClipboardProvider} from './contexts/CopyToClipboardContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CopyHistoryProvider>
      <CopyToClipboardProvider>
        <App/>
      </CopyToClipboardProvider>
    </CopyHistoryProvider>
  </React.StrictMode>
)
