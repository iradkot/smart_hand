import React from 'react';
import ReactDOM from 'react-dom/client';
import { CopyHistoryProvider } from './stateManagement/contexts';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/theme';
import AppRouter from './navigation/AppRouter';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import muiTheme from './style/muiTheme';
import GlobalStyles from './style/GlobalStyles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CopyHistoryProvider>
      <ThemeProvider theme={theme}>
        <MUIThemeProvider theme={muiTheme}>
          <GlobalStyles />
          <AppRouter />
        </MUIThemeProvider>
      </ThemeProvider>
    </CopyHistoryProvider>
  </React.StrictMode>
);
