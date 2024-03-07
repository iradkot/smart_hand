import React from 'react'
import styled from 'styled-components'
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from '@tanstack/react-table'

const TableContainer = styled.div`
  padding: 2rem;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const StyledTH = styled.th`
  position: relative;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background-color: #f5f5f5;
`

const Resizer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: ew-resize;
  &.isResizing {
    background-color: #0070f3;
  }
`

const StyledTD = styled.td`
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
`

interface Props {
  data: any[]
  columns: ColumnDef<any>[]
}

const GeneralizedTable: React.FC<Props> = ({ data, columns }) => {
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <StyledTH key={header.id} colSpan={header.colSpan}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanResize() && (
                    <Resizer
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={header.column.getIsResizing() ? 'isResizing' : ''}
                    />
                  )}
                </StyledTH>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <StyledTD key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </StyledTD>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  )
}

export default GeneralizedTable
