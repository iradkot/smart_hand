import React, { useState, useEffect, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import SectionContainer from './components/SectionContainer';
import SectionHeader from './components/SectionHeader/SectionHeader';
import SectionContent from './components/SectionContent';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useCopyHistory } from '../../stateManagement/contexts';
import { splitContent } from '../../utils/splitContent';
import { downloadTextAsTextFile } from '../../../../utils/downloadTextAsTextFile';

interface CopySectionsProps {
  content?: string;
  title?: string;
  language?: string;
}

const CopySections: React.FC<CopySectionsProps> = ({
                                                     content = "",
                                                     title = "Section",
                                                     language = "javascript"
                                                   }) => {
  const { copyToClipboardWithToast } = useCopyHistory();
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('dracula'); // Store theme name
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]); // References to sections

  const sections = splitContent(content);

  useEffect(() => {
    setCollapsed(Array(sections.length).fill(true)); // Initialize all sections as collapsed
  }, [content, sections.length]);

  const handleToggleCollapse = (index: number) => {
    setCollapsed((prevState) => {
      const newCollapsed = [...prevState];
      newCollapsed[index] = !newCollapsed[index];
      return newCollapsed;
    });
  };

  const handleDownload = () => {
    downloadTextAsTextFile(`${title}.txt`, content);
  };

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
  };

  return (
    <div>
      {sections.map((section, index) => (
        <SectionContainer key={index} ref={(el) => (sectionRefs.current[index] = el)}>
          <SectionHeader
            title={title}
            index={index}
            sectionsLength={sections.length}
            collapsed={collapsed[index]}
            onCopy={() => copyToClipboardWithToast(section, index)}
            onDownload={handleDownload} // Pass the download handler to SectionHeader
            onToggleCollapse={() => handleToggleCollapse(index)}
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
          <SectionContent
            collapsed={collapsed[index]}
            content={section}
            language={language}
            theme={themes[selectedTheme]}
          />
        </SectionContainer>
      ))}
    </div>
  );
};

export default CopySections;
