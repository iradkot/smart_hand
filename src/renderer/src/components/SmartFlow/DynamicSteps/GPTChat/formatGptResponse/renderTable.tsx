// formatGptResponse/renderTable.tsx
import React, { FC } from 'react'
import { StyledTable, StyledHeader, StyledCell } from '../../../../SmartTable/SmartTable'

import { parseMarkdownTable } from '../utils/parseMarkdownTable'
import { TableRow } from '../../../types'

type RenderTableProps = {
  segment: { content: TableRow[] }
}
export const renderTableSegment: FC<RenderTableProps> = ({ segment }) => {
  console.log({ segment })
  const tableData = segment.content
  if (!tableData) {
    return <div>Error: Could not parse table.</div>
  }
  return renderTableAsJSX(tableData)
}

const renderTableAsJSX = (tableData): JSX.Element => {
  console.log({ tableData })
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
