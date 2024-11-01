// types.ts

import { ContentNode } from 'src/types/pathHarvester.types'

export interface GenerateTestFileOutput {
  content: {
    testCode: string;
  };
}

export interface CreateInitialTestInput {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  testExamples: string;
  packageManager: string;
}

export interface CreateInitialTestContext extends CreateInitialTestInput {
  prompt: string;
  testCode: string;
  testFileName: string;
  testResult: TestResult | null;
  error: Error | null;
}

export interface TestMakerInput {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  packageJsonPath: string;
  contentTree: ContentNode;
  packageJsonContent: string;
}

export interface TestMakerContext extends TestMakerInput {
  contentTree: ContentNode;
  packageJsonContent: string;
  retries: number;
  maxRetries: number;
  testResult: TestResult | null;
  analyzedPackageJson: any;
  testExamples: string;
  projectPath: string;
  packageManager: string;
}

export interface TestResult {
  success: boolean;
  errorMessage?: string;
  details?: any;
}

export interface AnalyzeProjectOutput {
  analyzedPackageJson: any;
  packageManager: string;
}

export interface PrepareTestContextOutput {
  testExamples: string;
}

export type GenerateTestFileInput = {
  sessionId: string;
  fileContent: string;
  prompt: string;
};

export type WriteFileInput = {
  directoryPath: string;
  filePath: string;
  content: string;
};

export type ExecuteTestInput = {
  packageManager: string;
  projectPath: string;
  testFilePath: string;
};
