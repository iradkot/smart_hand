import { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { splitContent } from '../utils/splitContent';
import { downloadAsTextFile } from '../../../components/ui/GPTChat/utils';
import { useCopyHistory } from '../stateManagement/contexts/CopyHistoryContext';
import { IconButton, Button } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius}px;
  box-shadow: ${(props) => props.theme.shadow.default};
  background-color: ${(props) => props.theme.white};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.textSize}px;
  color: ${(props) => props.theme.textColor};
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const SectionContent = styled.div<{ collapsed: boolean }>`
  max-height: ${(props) => (props.collapsed ? '0' : 'auto')};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: ${(props) => (props.collapsed ? '0' : '10px')};
`;

const CopySections = ({ content = "", title = "Section" }) => {
  const { copyToClipboardWithToast } = useCopyHistory();
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]); // Store references to each section

  useEffect(() => {
    Prism.highlightAll();
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

  return (
    <div>
      <ToastContainer />
      {sections.map((section, index) => (
        <SectionContainer key={index}>
          <SectionHeader>
            <SectionTitle>
              {title}
              {sections.length > 1 && ` ${index + 1}/${sections.length}`}
            </SectionTitle>
            <HeaderActions>
              <Button
                variant="outlined"
                size="small"
                onClick={() => copyToClipboardWithToast(section, index)}
                style={{ marginRight: '10px' }}
              >
                Copy
              </Button>
              <IconButton onClick={() => handleToggleCollapse(index)}>
                {collapsed[index] ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            </HeaderActions>
          </SectionHeader>
          <SectionContent
            ref={(el) => (sectionRefs.current[index] = el)}
            collapsed={collapsed[index]}
          >
            <pre>
              <code className="language-javascript">{section}</code>
            </pre>
          </SectionContent>
        </SectionContainer>
      ))}
      <button onClick={handleDownload}>Download as Text File</button>
    </div>
  );
};

export default CopySections;
