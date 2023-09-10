import { TableRow } from '../../../types'

const hasConsistentColumns = (headers: TableRow, rows: TableRow[]): boolean => {
  const numColumns = headers.length
  return rows.every((row) => row.length === numColumns)
}

const parseLineToRow = (line: string): TableRow => {
  // Trim the leading and trailing pipe characters if present
  const trimmedLine = line.replace(/^\|/, '').replace(/\|$/, '')

  // Split the line by the pipe character to get each cell
  return trimmedLine.split('|').map((cell) => cell.trim())
}

export const parseMarkdownTable = (lines: string[]): TableRow[] | null => {
  if (!lines || lines.length === 0) {
    return null
  }

  // Parse each line into a TableRow (array of strings)
  const parsedLines = lines.map(parseLineToRow)

  // Assuming the first line is the header
  const headers = parsedLines[0]

  // Rows will be the remaining lines
  const rows = parsedLines.slice(2) // skip the header and separator lines

  if (!hasConsistentColumns(headers, rows)) {
    return null
  }

  return [headers, ...rows]
}
