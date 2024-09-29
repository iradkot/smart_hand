import React, { useEffect, useRef, useReducer, useMemo, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import SectionContainer from './components/SectionContainer';
import SectionHeader from './components/SectionHeader/SectionHeader';
import SectionContent from './components/SectionContent';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useCopyHistory } from '../../stateManagement/contexts';
import { splitContent } from '../../utils/splitContent';
import { downloadTextAsTextFile } from '../../../../utils/downloadTextAsTextFile';
import { PrismThemeName } from "../../../../types/libs.types";

interface CopySectionsProps {
  content?: string;
  title?: string;
  language?: string;
}

type CollapsedAction =
  | { type: 'INITIALIZE'; length: number }
  | { type: 'TOGGLE'; index: number };

const collapsedReducer = (state: boolean[], action: CollapsedAction): boolean[] => {
  switch (action.type) {
    case 'INITIALIZE':
      return Array(action.length).fill(true);
    case 'TOGGLE':
      return state.map((item, idx) => (idx === action.index ? !item : item));
    default:
      return state;
  }
};

const CopySections: React.FC<CopySectionsProps> = ({
                                                     content = "",
                                                     title = "Section",
                                                     language = "javascript"
                                                   }) => {
  const { copyToClipboardWithToast } = useCopyHistory();

  // Memoize splitContent to optimize performance
  const sections = useMemo(() => splitContent(content), [content]);

  // Use reducer for collapsed state management
  const [collapsed, dispatch] = useReducer(collapsedReducer, [], () => Array(sections.length).fill(true));

  // Update collapsed state when sections length changes
  useEffect(() => {
    dispatch({ type: 'INITIALIZE', length: sections.length });
  }, [sections.length]);

  const [selectedTheme, setSelectedTheme] = useState<PrismThemeName>('dracula');

  // Memoize the current theme
  const currentTheme = useMemo(() => themes[selectedTheme], [selectedTheme]);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggleCollapse = (index: number) => {
    dispatch({ type: 'TOGGLE', index });
  };

  const handleDownload = () => {
    downloadTextAsTextFile(`${title}.txt`, content);
  };

  const handleThemeChange = (themeName: PrismThemeName) => {
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
            onDownload={handleDownload}
            onToggleCollapse={() => handleToggleCollapse(index)}
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
          <SectionContent
            collapsed={collapsed[index]}
            content={section}
            language={language}
            theme={currentTheme}
          />
        </SectionContainer>
      ))}
    </div>
  );
};

export default CopySections;
