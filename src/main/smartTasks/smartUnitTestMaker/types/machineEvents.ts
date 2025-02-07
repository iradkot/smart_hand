// src/main/smartTasks/smartUnitTestMaker/types/machineEvents.ts
import {
  FileAnalysisResult,
  LlmClassificationResult,
  TestGenerationResult,
  TestResult,
} from './flows';

/**
 *  Events for the analyzeFile service.
 */
export interface DoneAnalyzeFile {
  type: 'done.invoke.analyzeFile';
  output: FileAnalysisResult;
}
export interface ErrorAnalyzeFile {
  type: 'error.platform.analyzeFile';
  error: any; // or unknown
}

/**
 * Events for the classifyFile service.
 */
export interface DoneClassifyFile {
  type: 'done.invoke.classifyFile';
  output: LlmClassificationResult;
}
export interface ErrorClassifyFile {
  type: 'error.platform.classifyFile';
  error: any;
}

/**
 * Events for the generateTest service.
 */
export interface DoneGenerateTest {
  type: 'done.invoke.generateTest';
  output: TestGenerationResult;
}
export interface ErrorGenerateTest {
  type: 'error.platform.generateTest';
  error: any;
}

/**
 * Events for the executeTest service.
 */
export interface DoneExecuteTest {
  type: 'done.invoke.executeTest';
  output: TestResult;
}
export interface ErrorExecuteTest {
  type: 'error.platform.executeTest';
  error: any;
}

/**
 * Events for the fixTestFailure service.
 */
export interface DoneFixTestFailure {
  type: 'done.invoke.fixTestFailure';
  output: TestResult;
}
export interface ErrorFixTestFailure {
  type: 'error.platform.fixTestFailure';
  error: any;
}

/**
 * The union of all possible events in the test maker state machine.
 */
export type TestMakerEvent =
  | DoneAnalyzeFile
  | ErrorAnalyzeFile
  | DoneClassifyFile
  | ErrorClassifyFile
  | DoneGenerateTest
  | ErrorGenerateTest
  | DoneExecuteTest
  | ErrorExecuteTest
  | DoneFixTestFailure
  | ErrorFixTestFailure;

