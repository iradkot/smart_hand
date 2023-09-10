// formatGptResponse/splitAndCategorizeGptResponse.ts

import { isTabular, isCodeBlock } from '../utils'
import { parseMarkdownTable } from './parseMarkdownTable'
import { TableRow } from '../../../types'
type GptResponseSegment = {
  type: 'table' | 'code' | 'text'
  content: TableRow[] | string
}

const appendToLastSegment = (acc: GptResponseSegment[], line: string, type: string) => {
  const lastSegment = acc.length > 0 ? acc[acc.length - 1] : null
  if (lastSegment && lastSegment.type === type) {
    lastSegment.content.push(line)
  } else {
    acc.push({ type, content: [line] })
  }
}

const segmentType = (line: string) => {
  if (isTabular(line)) return 'table'
  if (isCodeBlock(line)) return 'code'
  return 'text'
}

/**
 * Splits the GPT response into its segments.
 * @param gptResponse - The GPT response containing different segments.
 * @return An array of segments for rendering.
 */
export const splitAndCategorizeGptResponse = (gptResponse: string | any): GptResponseSegment[] => {
  if (!gptResponse) {
    return []
  }

  // Convert string-based GPT response into an array for uniform handling
  const responseArray = Array.isArray(gptResponse) ? gptResponse : gptResponse.split('\n')

  const categorizedResponse = responseArray.reduce((acc: GptResponseSegment[], line: string) => {
    appendToLastSegment(acc, line, segmentType(line))
    return acc
  }, [])

  return categorizedResponse.map((segment) => {
    if (segment.type === 'table') {
      segment.content = parseMarkdownTable(segment.content as TableRow[])
    }
    return segment
  })
}
