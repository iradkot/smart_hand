// tableParser.js


const parseHTMLTable = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return [];

  const rows = Array.from(table.querySelectorAll('tr'));
  return rows.map(row =>
    Array.from(row.querySelectorAll('td, th')).map(cell => cell.innerText)
  );
};

export const parseTableString = (tableString, options = {}) => {
  const {
    skipEmptyRows = true,
    skipComments = true,
    commentIndicator = '#',
    convertToNumbers = true,
  } = options

  if (!tableString) {
    return []
  }

  const rows = tableString.split('\n')

  return rows
    .filter((row) => {
      if (skipEmptyRows && row.trim() === '') {
        return false
      }
      if (skipComments && row.trim().startsWith(commentIndicator)) {
        return false
      }
      return true
    })
    .map((row) =>
      row
        .trim()
        .split('|')
        .map((cell) => {
          const trimmedCell = cell.trim()
          if (convertToNumbers && !isNaN(trimmedCell)) {
            return Number(trimmedCell)
          }
          return trimmedCell
        }),
    )
}
