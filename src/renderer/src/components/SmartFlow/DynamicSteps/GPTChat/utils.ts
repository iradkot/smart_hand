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

export const isCodeBlock = (string) => {
  return string.includes('```') && string.includes('```')
}
