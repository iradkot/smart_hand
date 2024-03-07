// formatGptResponse/index.tsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkLint from 'remark-lint'
import remarkToc from 'remark-toc'
import remarkExtendedTable from 'remark-extended-table'

export const renderGPTResponse = (gptResponse: any): JSX.Element[] => {
  console.log({ gptResponse })
  return (
    <ReactMarkdown
      children={gptResponse}
      remarkPlugins={[remarkGfm, remarkBreaks, remarkLint, remarkToc, remarkExtendedTable]}
    />
  )
}
