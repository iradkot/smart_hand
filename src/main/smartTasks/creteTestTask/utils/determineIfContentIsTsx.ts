function determineIfContentIsTsx(fileContent: string): boolean {
  // Check for JSX syntax
  const hasJsx = /<([A-Za-z]+|\/[A-Za-z]+)>/.test(fileContent);

  // Check for React imports
  const hasReactImport = /import\s+React\s+from\s+['"]react['"]/.test(fileContent);
  console.log('got - ', fileContent, ' - ', hasJsx, ' - ', hasReactImport);
  return hasJsx || hasReactImport;
}

export default determineIfContentIsTsx;
