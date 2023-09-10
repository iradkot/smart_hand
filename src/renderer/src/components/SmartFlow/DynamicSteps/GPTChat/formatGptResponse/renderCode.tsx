// formatGptResponse/renderCode.tsx
import React from 'react'

export const renderCodeSegment = (segment: any, index: number): JSX.Element => (
  <pre key={index}>
    <code>{segment.content.replace(/```/g, '')}</code>
  </pre>
);
