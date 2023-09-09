// Function to parse an HTML table from a string
export const parseHTMLTable = (htmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const table = doc.querySelector('table')
  if (!table) return []

  const rows = Array.from(table.querySelectorAll('tr'))
  return rows.map((row) => Array.from(row.querySelectorAll('td, th')).map((cell) => cell.innerText))
}
// Function to check if a string contains tabular data
export const isTabular = (string) => {
  return string.includes('|')
}

/**
 * Parse a Markdown table into its headers and rows.
 *
 * @param markdownString - The Markdown table string to parse.
 * @return An array where the first element is the headers and the remaining elements are the rows, or null if parsing fails.
 */
export const parseMarkdownTable = (markdownString: string): string[][] | null => {
  // Check for empty or null input
  if (!markdownString) {
    return null
  }

  // Normalize and split input by lines
  const lines = markdownString
    .trim()
    .split('\n')
    .map((line) => line.trim())

  // Ensure we have a header and a separator line at least
  if (lines.length < 2) {
    return null
  }

  // Parse header
  const headers = lines[0].split('|').map((str) => str.trim())

  // Skip the separator line and parse rows
  const rows = lines.slice(2).map((line) => line.split('|').map((str) => str.trim()))

  // Check for consistent number of columns
  const numColumns = headers.length
  if (!rows.every((row) => row.length === numColumns)) {
    return null
  }

  return [headers, ...rows]
}

export const isCodeBlock = (string) => {
  return string.includes('```') && string.includes('```')
}

export const splitGptResponse = (response) => {
  const segments = []
  let buffer = ''
  let mode = 'text' // Possible modes: 'text', 'table', 'code'
  let tableBuffer = ''
  let codeBuffer = ''

  const lines = response.split('\n')

  for (const line of lines) {
    if (line.startsWith('```')) {
      // End of a code block or beginning of a new one
      if (mode === 'code') {
        // End of the code block
        segments.push({ type: 'code', content: codeBuffer.trim() })
        codeBuffer = ''
        mode = 'text'
      } else {
        // Beginning of a code block
        if (buffer) {
          segments.push({ type: mode, content: buffer.trim() })
          buffer = ''
        }
        mode = 'code'
      }
    } else if (line.startsWith('|')) {
      // Table line
      if (mode !== 'table') {
        // New table starting
        if (buffer) {
          segments.push({ type: mode, content: buffer.trim() })
          buffer = ''
        }
        mode = 'table'
      }
      tableBuffer += line + '\n'
    } else {
      // Text line
      if (mode === 'table') {
        // End of the table
        segments.push({ type: 'table', content: tableBuffer.trim() })
        tableBuffer = ''
      } else if (mode === 'code') {
        // Inside a code block
        codeBuffer += line + '\n'
        continue
      }
      mode = 'text'
      buffer += line + '\n'
    }
  }

  // Flush any remaining content
  if (buffer) {
    segments.push({ type: 'text', content: buffer.trim() })
  }
  if (tableBuffer) {
    segments.push({ type: 'table', content: tableBuffer.trim() })
  }
  if (codeBuffer) {
    segments.push({ type: 'code', content: codeBuffer.trim() })
  }

  return segments
}
