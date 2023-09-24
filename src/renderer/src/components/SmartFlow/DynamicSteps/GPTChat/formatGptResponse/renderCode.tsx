// formatGptResponse/renderCode.tsx
import React from 'react'
import {gptChatCodeSegment, gptChatTableSegment} from '../../../types'

export const renderCodeSegment = (segment: gptChatCodeSegment, index: number): JSX.Element => {
  console.log({ segment })
  return (
    <pre key={index}>
      <code>{segment.content.replace(/```/g, '')}</code>
    </pre>
  );
}
