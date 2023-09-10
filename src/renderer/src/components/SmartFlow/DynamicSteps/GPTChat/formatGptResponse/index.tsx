// formatGptResponse/index.tsx
import React from 'react'
import { splitAndCategorizeGptResponse } from '../utils/splitAndCategorizeGptResponse'
import { renderTableSegment } from './renderTable'
import { renderCodeSegment } from './renderCode'
import { renderTextSegment } from './renderText'

export const renderGPTResponse = (gptResponse: any): JSX.Element[] => {
  const segments = splitAndCategorizeGptResponse(gptResponse)
  console.log({ segments })

  return segments.map((segment, index) => {
    switch (segment.type) {
      case 'table':
        return renderTableSegment({segment })
      case 'code':
        return renderCodeSegment(segment, index)
      case 'text':
      default:
        return renderTextSegment(segment, index)
    }
  })
}
