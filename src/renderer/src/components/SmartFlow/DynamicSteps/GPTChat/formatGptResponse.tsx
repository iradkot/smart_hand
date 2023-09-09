// formatGptResponse.tsx
import React from 'react'
import {
  isTabular,
  isCodeBlock,
  parseHTMLTable,
  parseMarkdownTable,
  splitGptResponse,
} from './utils'

import { StyledTable, StyledHeader, StyledCell } from '../../../SmartTable/SmartTable'

const renderGPTResponseAsTable = (tableData) => {
  if (!tableData) return 'error generating table';
  const [headers, ...rows] = tableData
  return (
    <StyledTable>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <StyledHeader key={`header-${index}`}>{header}</StyledHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <StyledCell key={`cell-${rowIndex}-${cellIndex}`}>{cell}</StyledCell>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  )
}

/**
 * Render the GPT response based on its segment type.
 * @param gptResponse - The GPT response containing different segments.
 * @return An array of JSX elements for rendering.
 */
export const renderGPTResponse = (gptResponse: any): JSX.Element[] => {
  console.log("GPT Response:", gptResponse);

  const segments = splitGptResponse(gptResponse);
  console.log("Segments:", segments);


  return segments.map((segment, index) => {
    return renderSegment(segment, index);
  });
}

/**
 * Render a single segment based on its type.
 * @param segment - The segment to render.
 * @param index - The index used for key in JSX elements.
 * @return A JSX element for rendering.
 */
const renderSegment = (segment: any, index: number): JSX.Element => {
  switch (segment.type) {
    case 'table':
      return renderTableSegment(segment);
    case 'code':
      return renderCodeSegment(segment, index);
    case 'text':
    default:
      return renderTextSegment(segment, index);
  }
}

const renderTableSegment = (segment: any): JSX.Element => {
  console.log("Segment Content:", segment.content);

  const tableData = parseMarkdownTable(segment.content);
  if (!tableData) {
    // Handle null case
    return <div>Error: Could not parse table.</div>;
  }
  if (segment.isLast) {
    const lastRow = segment.lastRow.split('|').map((cell) => cell.trim());
    tableData.push(lastRow);
  }
  return renderGPTResponseAsTable(tableData);
}

const renderCodeSegment = (segment: any, index: number): JSX.Element => (
  <pre key={index}>
    <code>{segment.content.replace(/```/g, '')}</code>
  </pre>
);

const renderTextSegment = (segment: any, index: number): JSX.Element => (
  <div key={index}>{segment.content}</div>
);

