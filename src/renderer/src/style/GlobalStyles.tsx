// src/renderer/src/style/GlobalStyles.tsx

import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <MUIGlobalStyles
      styles={{
        '.MuiButton-root': {
          transition: 'background-color 0.3s ease, color 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.primary,
          },
        },
        '.MuiAccordionSummary-root': {
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
          },
        },
      }}
    />
  );
};

export default GlobalStyles;
