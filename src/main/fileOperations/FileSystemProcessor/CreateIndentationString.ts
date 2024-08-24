export function createIndentationString(level: number, isLastItem: boolean): string {
  const branchSymbols = {
    vertical: "│   ",
    standard: "├── ",
    last: "└── ",
  };

  // Create indentation based on level
  const indentations = level > 0 ? Array(level).fill(branchSymbols.vertical) : [];

  // Replace the last element with the correct branch symbol
  if (indentations.length > 0) {
    indentations[indentations.length - 1] = isLastItem ? branchSymbols.last : branchSymbols.standard;
  } else {
    indentations.push(isLastItem ? branchSymbols.last : branchSymbols.standard);
  }

  return indentations.join("");
}
