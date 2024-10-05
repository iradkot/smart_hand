// createTestTask/utilities/inferFileExtension.ts

export function inferFileExtension(fileContent: string): string {
  const hasJsx = /<([A-Za-z]+|\/[A-Za-z]+)>/.test(fileContent);
  const hasReactImport = /import\s+React\s+from\s+['"]react['"]/.test(fileContent);
  return hasJsx || hasReactImport ? 'tsx' : 'ts';
}
