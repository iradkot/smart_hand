// testRunner/testCommandBuilder.ts

export function buildTestCommand(packageManager: string, testFilePath: string): string {
  return `${packageManager} test --runTestsByPath "${testFilePath}" --json --outputFile=jest-results.json`;
}
