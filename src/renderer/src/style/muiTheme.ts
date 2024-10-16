// src/style/muiTheme.ts

import { createTheme } from '@mui/material/styles';
import { theme as customTheme } from './theme'; // Import your existing theme

const muiTheme = createTheme({
  palette: {
    mode: customTheme.dark ? 'dark' : 'light',
    primary: {
      main: customTheme.buttonBackgroundColor,
    },
    secondary: {
      main: customTheme.accentColor,
    },
    success: {
      main: customTheme.inRangeColor,
    },
    error: {
      main: customTheme.belowRangeColor,
    },
    warning: {
      main: customTheme.aboveRangeColor,
    },
    background: {
      default: customTheme.backgroundColor,
      paper: customTheme.white,
    },
    text: {
      primary: customTheme.textColor,
    },
    divider: customTheme.borderColor,
  },
  typography: {
    fontFamily: customTheme.fontFamily,
    fontSize: customTheme.textSize,
    h6: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: customTheme.borderRadius,
  },
  shadows: [
    'none',
    customTheme.shadow.small,
    customTheme.shadow.default,
    customTheme.shadow.dark,
    customTheme.shadow.bright,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: customTheme.borderRadius,
          boxShadow: customTheme.shadow.default,
          '&:hover': {
            backgroundColor: customTheme.buttonBackgroundColor,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: customTheme.shadow.default,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: customTheme.shades.light,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: customTheme.buttonBackgroundColor,
        },
      },
    },
  },
});

export default muiTheme;
