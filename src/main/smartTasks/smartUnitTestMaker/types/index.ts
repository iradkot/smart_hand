// src/main/smartTasks/smartUnitTestMaker/types/index.ts

import {ContentNode} from 'src/types/pathHarvester.types';

export interface GenerateTestFileOutput {
  content: {
    testDescription?: any;
    testFileName?: string;
    testCode: string;
    runCommand?: string;
    requestedFiles?: string[];
  };
}

export interface CreateInitialTestInput {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  testExamples: string;
  packageManager: string;
  filePathsString: string;
  additionalFiles?: string;
  requestedFiles?: string[];
  contentTree: ContentNode;
}

export interface CreateInitialTestContext extends CreateInitialTestInput {
  prompt: string;
  testCode: string;
  testFileName: string;
  filePathsString: string;
  additionalFiles?: string;
  requestedFiles?: string[];
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
  requestedFiles?: string[];
  additionalFiles?: string;
}

export interface TestMakerContext extends TestMakerInput {
  retries: number;
  maxRetries: number;
  testResult: TestResult | null;
  analyzedPackageJson: any;
  testExamples: string;
  projectPath: string;
  packageManager: string;
  requestedFiles?: string[];
  error: Error | null;
  filePathsString: string;
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
