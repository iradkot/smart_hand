// src/features/CopySections/components/SectionContent/SectionContent.tsx

import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const ContentContainer = styled.div<{ collapsed: boolean }>`
  max-height: ${(props) => (props.collapsed ? '0' : 'auto')};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: ${(props) => (props.collapsed ? '0' : '15px')};
  background-color: ${(props) => props.theme.white};
`;

interface SectionContentProps {
  collapsed: boolean;
  content: string;
  language: string;
  theme: any;
}

const SectionContent: React.FC<SectionContentProps> = ({
                                                         collapsed,
                                                         content,
                                                         language,
                                                         theme,
                                                       }) => {
  return (
    <ContentContainer collapsed={collapsed}>
      <SyntaxHighlighter language={language} style={theme}>
        {content}
      </SyntaxHighlighter>
    </ContentContainer>
  );
};

export default SectionContent;
