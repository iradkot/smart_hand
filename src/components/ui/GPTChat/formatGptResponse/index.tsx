import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkLint from 'remark-lint';
import remarkToc from 'remark-toc';
import remarkExtendedTable from 'remark-extended-table';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // Import a CSS theme for code blocks

import './MarkdownStyles.css'; // Custom CSS for enhanced Markdown rendering

export const renderGPTResponse = (gptResponse: any): JSX.Element => {
  console.log({ gptResponse });

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
        }}
      />
    </div>
  );
};
