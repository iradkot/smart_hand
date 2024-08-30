import React from 'react';
import styled from 'styled-components';
import { Button, IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess, FileCopyOutlined, CloudDownloadOutlined } from '@material-ui/icons';
import ThemeSelector from './ThemeSelector';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  background-color: ${(props) => props.theme.backgroundColor};
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.shades.lighter};
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.textSize * 1.1}px;
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;

  button, svg {
    margin-left: 10px;
  }
`;

interface SectionHeaderProps {
  title: string;
  index: number;
  sectionsLength: number;
  collapsed: boolean;
  onCopy: () => void;
  onDownload: () => void; // Added prop for download
  onToggleCollapse: () => void;
  selectedTheme: string;
  onThemeChange: (themeName: string) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
                                                       title,
                                                       index,
                                                       sectionsLength,
                                                       collapsed,
                                                       onCopy,
                                                       onDownload, // Added prop for download
                                                       onToggleCollapse,
                                                       selectedTheme,
                                                       onThemeChange,
                                                     }) => {
  const handleHeaderClick = (e: React.MouseEvent) => {
    // Prevent toggling collapse when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;
    onToggleCollapse();
  };

  return (
    <HeaderContainer onClick={handleHeaderClick}>
      <SectionTitle>
        {title}
        {sectionsLength > 1 && ` ${index + 1}/${sectionsLength}`}
      </SectionTitle>
      <HeaderActions>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          startIcon={<FileCopyOutlined />}
        >
          Copy
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          startIcon={<CloudDownloadOutlined />}
        >
          Download
        </Button>
        <ThemeSelector
          selectedTheme={selectedTheme}
          onThemeChange={onThemeChange}
        />
        <IconButton onClick={onToggleCollapse}>
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default SectionHeader;
