// createTestTask/types/testState.types.ts

export interface TestState {
  testCode: string;
  testFileName: string;
  lastErrorMessage: string;
  additionalFilesContent: Record<string, string>;
}
