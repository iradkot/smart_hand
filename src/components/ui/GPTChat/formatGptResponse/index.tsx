import React, {HTMLAttributes, ReactElement} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkLint from 'remark-lint';
import remarkToc from 'remark-toc';
import remarkExtendedTable from 'remark-extended-table';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/monokai.css';
import {CodeBlock, CodeSnippet, CopyButton, MarkdownContainer, TableCell, TableContainer, TableHeader} from "./styles"; // Import a dark theme for code blocks

interface CodeProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const renderGPTResponse = (gptResponse: any): JSX.Element => {

  const handleCopyClick = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    alert('Code copied to clipboard!');
  };
  const extractTextFromChildren = (children: React.ReactNode): string => {
    if (Array.isArray(children)) {
      return children
        .map((child) => {
          if (typeof child === 'string') {
            return child;
          } else if (React.isValidElement(child)) {
            // Typecast child to ReactElement to access props
            return extractTextFromChildren((child as ReactElement).props.children);
          } else {
            return '';
          }
        })
        .join('');
    } else if (typeof children === 'string') {
      return children;
    } else {
      return '';
    }
  };
  return (
    <MarkdownContainer>
      <ReactMarkdown
        children={gptResponse}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkLint, remarkToc, remarkExtendedTable]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        components={{
          table({ node, ...props }) {
            return (
              <TableContainer>
                <table {...props} />
              </TableContainer>
            );
          },
          th({ node, ...props }) {
            return <TableHeader {...props} />;
          },
          td({ node, ...props }) {
            return <TableCell {...props} />;
          },
          code({ inline, className, children, ...props }: CodeProps) {
            const codeText = extractTextFromChildren(children);
            if (inline) {
              return <CodeSnippet className={className} {...props}>{children}</CodeSnippet>;
            }

            return (
              <CodeBlock {...props as HTMLAttributes<HTMLPreElement>}>
                <CopyButton onClick={() => handleCopyClick(codeText)}>
                  Copy
                </CopyButton>
                <code className={`${className}`} {...props}>{children}</code>
              </CodeBlock>
            );
          },
        }}
      />
    </MarkdownContainer>
  );
};

export default renderGPTResponse;
