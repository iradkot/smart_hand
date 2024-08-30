import { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { splitContent } from '../utils/splitContent';
import { downloadAsTextFile } from '../../../components/ui/GPTChat/utils';
import { IconButton, Button, Select, MenuItem } from '@material-ui/core';
import { ExpandMore, ExpandLess, FileCopyOutlined, CloudDownloadOutlined } from '@material-ui/icons';
import { useCopyHistory } from "../stateManagement/contexts";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 15px;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius}px;
  box-shadow: ${(props) => props.theme.shadow.default};
  background-color: ${(props) => props.theme.shades.light};
`;

const SectionHeader = styled.div`
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

const SectionContent = styled.div<{ collapsed: boolean }>`
  max-height: ${(props) => (props.collapsed ? '0' : 'auto')};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: ${(props) => (props.collapsed ? '0' : '15px')};
  background-color: ${(props) => props.theme.white};
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.buttonBackgroundColor};
  color: ${(props) => props.theme.buttonTextColor};
  &:hover {
    background-color: ${(props) => props.theme.accentColor};
  }
`;

const DownloadButton = styled(StyledButton)`
  margin-top: 15px;
  display: block;
  width: 100%;
`;

const ThemeSelector = styled(Select)`
  margin-left: 10px;
  font-size: 0.8rem;
  height: 32px;
  min-width: 100px;

  .MuiSelect-outlined {
    padding: 5px 10px;
  }
`;

const CopySections = ({ content = "", title = "Section", language = "javascript" }) => {
  const { copyToClipboardWithToast } = useCopyHistory();
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [selectedTheme, setSelectedTheme] = useState(themes.dracula); // Default theme set to Dracula
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]); // Store references to each section

  useEffect(() => {
    setCollapsed(Array(sections.length).fill(true)); // Initialize all sections as collapsed
  }, [content]);

  const sections = splitContent(content);

  const handleToggleCollapse = (index: number) => {
    setCollapsed((prevState) => {
      const newCollapsed = [...prevState];
      newCollapsed[index] = !newCollapsed[index];
      return newCollapsed;
    });
  };

  const handleDownload = async () => {
    try {
      downloadAsTextFile(`${title}.txt`, content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const themeName = event.target.value as string;
    setSelectedTheme(themes[themeName]);
  };

  return (
    <div>
      <ToastContainer />
      {sections.map((section, index) => (
        <SectionContainer key={index}>
          <SectionHeader onClick={() => handleToggleCollapse(index)}>
            <SectionTitle>
              {title}
              {sections.length > 1 && ` ${index + 1}/${sections.length}`}
            </SectionTitle>
            <HeaderActions>
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => copyToClipboardWithToast(section, index)}
                startIcon={<FileCopyOutlined />}
              >
                Copy
              </StyledButton>
              <ThemeSelector
                value={Object.keys(themes).find((key) => themes[key] === selectedTheme) || 'dracula'}
                onChange={handleThemeChange}
                variant="outlined"
              >
                {Object.keys(themes).map((themeName) => (
                  <MenuItem key={themeName} value={themeName}>
                    {themeName}
                  </MenuItem>
                ))}
              </ThemeSelector>
              <IconButton onClick={() => handleToggleCollapse(index)}>
                {collapsed[index] ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            </HeaderActions>
          </SectionHeader>
          <SectionContent
            ref={(el) => (sectionRefs.current[index] = el)}
            collapsed={collapsed[index]}
          >
            <SyntaxHighlighter language={language} style={selectedTheme}>
              {section}
            </SyntaxHighlighter>
          </SectionContent>
        </SectionContainer>
      ))}
      <DownloadButton
        variant="contained"
        startIcon={<CloudDownloadOutlined />}
        onClick={handleDownload}
      >
        Download as Text File
      </DownloadButton>
    </div>
  );
};

export default CopySections;
