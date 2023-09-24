// formatGptResponse/index.tsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkLint from 'remark-lint'
import remarkToc from 'remark-toc'

export const renderGPTResponse = (gptResponse: any): JSX.Element[] => {
  // const segments = splitAndCategorizeGptResponse(gptResponse)
  // console.log({ segments })
  return (
    <ReactMarkdown
      children={gptResponse}
      remarkPlugins={[remarkGfm, remarkBreaks, remarkLint, remarkToc]}
    />
  )
}
