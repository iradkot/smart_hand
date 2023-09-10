// formatGptResponse/renderText.tsx
import React from 'react'

export const renderTextSegment = (segment: any, index: number): JSX.Element => (
  <div key={index}>{segment.content}</div>
);
