// src/features/CopySections/components/SectionHeader/ThemeSelector.tsx

import React from 'react';
import styled from 'styled-components';
import { Select, MenuItem } from '@material-ui/core';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';

const StyledSelect = styled(Select)`
  margin-left: 10px;
  font-size: 0.8rem;
  height: 32px;
  min-width: 120px;

  .MuiSelect-outlined {
    padding: 5px 10px;
  }
`;

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeName: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
                                                       selectedTheme,
                                                       onThemeChange,
                                                     }) => {
  return (
    <StyledSelect
      value={selectedTheme}
      onChange={(e) => onThemeChange(e.target.value as string)}
      variant="outlined"
      onClick={(e) => e.stopPropagation()} // Prevent header toggle when interacting with selector
    >
      {Object.keys(themes).map((themeName) => (
        <MenuItem key={themeName} value={themeName}>
          {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
        </MenuItem>
      ))}
    </StyledSelect>
  );
};

export default ThemeSelector;
