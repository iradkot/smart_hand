import styled from "styled-components";

export const MarkdownContainer = styled.div`
  font-family: ${({theme}) => theme.fontFamily};
  line-height: ${({theme}) => theme.lineHeight};
  color: ${({theme}) => theme.textColor};

  h1, h2, h3 {
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
    padding-bottom: 0.3em;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }
`;
export const TableContainer = styled.div`
  overflow-x: auto;
`;
export const TableHeader = styled.th`
  border: 1px solid ${({theme}) => theme.borderColor};
  padding: 8px;
  background-color: ${({theme}) => theme.white};
  text-align: left;
`;
export const TableCell = styled.td`
  border: 1px solid ${({theme}) => theme.borderColor};
  padding: 8px;
`;
export const CodeBlock = styled.pre`
  background-color: ${({theme}) => theme.shades.dark}; /* Dark background */
  color: ${({theme}) => theme.white}; /* Light text for contrast */
  padding: 1em;
  border-radius: ${({theme}) => theme.borderRadius}px;
  overflow-x: auto;
`;
export const CodeSnippet = styled.code`
  background-color: ${({theme}) => theme.shades.dark}; /* Dark background for inline code */
  color: ${({theme}) => theme.white}; /* Light text for contrast */
  border-radius: 3px;
  padding: 0.2em 0.4em;
  font-size: 85%;
`;
export const CopyButton = styled.button`
  margin-bottom: 0.5em;
  background-color: ${({theme}) => theme.accentColor}; /* Use theme color */
  color: ${({theme}) => theme.buttonTextColor};
  border: none;
  padding: 0.5em 1em;
  border-radius: ${({theme}) => theme.borderRadius}px;
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.buttonBackgroundColor};
  }
`;
