import React, { HTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkLint from 'remark-lint';
import remarkToc from 'remark-toc';
import remarkExtendedTable from 'remark-extended-table';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/monokai.css'; // Import a dark theme for code blocks

import './MarkdownStyles.css'; // Custom CSS for enhanced Markdown rendering

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
            return extractTextFromChildren(child.props.children);
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
    <div className="markdown-container">
      <ReactMarkdown
        children={gptResponse}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkLint, remarkToc, remarkExtendedTable]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        components={{
          table({ node, ...props }) {
            return (
              <div className="table-container">
                <table {...props} />
              </div>
            );
          },
          th({ node, ...props }) {
            return <th style={{ backgroundColor: '#f0f0f0', padding: '8px' }} {...props} />;
          },
          td({ node, ...props }) {
            return <td style={{ border: '1px solid #ddd', padding: '8px' }} {...props} />;
          },
          code({ inline, className, children, ...props }: CodeProps) {
            const codeText = extractTextFromChildren(children);
            if (inline) {
              return <code className={className} {...props}>{children}</code>;
            }

            return (
              <div className="code-block">
                <button className="copy-button" onClick={() => handleCopyClick(codeText)}>
                  Copy
                </button>
                <pre {...props as HTMLAttributes<HTMLPreElement>}>
                  <code className={`${className} dark-theme-code`} {...props}>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      />
    </div>
  );
};
