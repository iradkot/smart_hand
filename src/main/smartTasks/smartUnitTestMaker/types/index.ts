// types/index.ts

import { ContentNode } from "src/types/pathHarvester.types";

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

export type TestMakerEvent =
  | { type: 'START' }
  | { type: 'done'; data?: any }
  | { type: 'error' };

export interface TestResult {
  success: boolean;
  errorMessage?: string;
  details?: any;
}

export interface AIResponse {
  choices: Array<{
    text: string;
  }>;
}


