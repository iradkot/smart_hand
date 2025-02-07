// src/main/smartTasks/smartUnitTestMaker/types/flows.ts

export interface ImportEntry {
  source: string; // e.g., 'react'
  raw: string;    // raw import line
}

export interface FileAnalysisResult {
  imports: ImportEntry[];
  isReactComponent?: boolean;
}

export interface LlmClassificationResult {
  fileType: string;      // e.g. "ReactComponent", "NodeUtility"
  mocksNeeded: string[]; // e.g. ["axios", "./someLocalFile"]
}

export interface TestGenerationResult {
  testFileName: string;
  testCode: string;
}

export interface TestResult {
  success: boolean;
  errorMessage?: string;
  details?: any; // store jest or mocha test details, if you like
}

export interface FileAnalysisParams {
  directoryPath: string;
  fileName: string;
}

export interface ClassificationParams {
  sessionId: string;
  fileContent: string;
  analysis: FileAnalysisResult;
}

export interface TestGenerationParams {
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  classification: LlmClassificationResult;
}

export interface TestExecutionParams {
  packageManager: string;
  directoryPath: string;
  testFileName: string;
}

export interface FailureFixParams {
  sessionId: string;
  directoryPath: string;
  testFileName: string;
  lastError: string;
  packageManager: string;
}
