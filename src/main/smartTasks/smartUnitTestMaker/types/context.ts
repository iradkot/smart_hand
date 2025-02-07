// src/main/smartTasks/smartUnitTestMaker/types/context.ts

import {
  FileAnalysisResult,
  LlmClassificationResult,
  TestGenerationResult,
  TestResult,
} from './flows';

/**
 * The context for our XState machine:
 */
export interface TestMakerContext {
  // Inputs
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  packageManager: string;

  // Results stored along the way
  analysis: FileAnalysisResult | null;
  classification: LlmClassificationResult | null;
  testGeneration: TestGenerationResult | null;
  testResult: TestResult | null;

  // Control how many times we can retry
  retries: number;
  maxRetries: number;

  // Optional debugging or error-tracking
  error: unknown | null;
}

/**
 * The data provided as machine input.
 */
export interface TestMakerInput {
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  packageManager: string;
  maxRetries?: number;
}
