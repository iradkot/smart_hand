export function createIndentationString(level: number, isLastItem: boolean): string {
  const branchSymbols = {
    vertical: "│   ",
    standard: "├── ",
    last: "└── ",
  };

  // Create indentation based on level
  const indentations = level > 1 ? Array(level - 1).fill(branchSymbols.vertical) : [];

  // Add the appropriate branch symbol
  indentations.push(isLastItem ? branchSymbols.last : branchSymbols.standard);

  return indentations.join("");
}
