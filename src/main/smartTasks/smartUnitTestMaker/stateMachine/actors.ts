import { fromPromise } from 'xstate';
import { fileAnalysisFlow, llmClassificationFlow, testGenerationFlow, testExecutionFlow, handleTestFailureFlow } from '../flows';
import { Services } from './constants';

import type {
  FileAnalysisResult,
  FileAnalysisParams,
  LlmClassificationResult,
  ClassificationParams,
  TestGenerationResult,
  TestGenerationParams,
  TestResult,
  TestExecutionParams,
  FailureFixParams,
} from '../types';

/**
 * testMakerActors:
 * This is an object of keys --> fromPromise(...) calls.
 * Each fromPromise(...) is a valid ActorLogic that XState can invoke by string key.
 */
export const testMakerActors = {
  [Services.analyzeFile]: fromPromise<FileAnalysisResult, FileAnalysisParams>(
    async ({ input }) => fileAnalysisFlow(input)
  ),
  [Services.classifyFile]: fromPromise<LlmClassificationResult, ClassificationParams>(
    async ({ input }) => llmClassificationFlow(input)
  ),
  [Services.generateTest]: fromPromise<TestGenerationResult, TestGenerationParams>(
    async ({ input }) => testGenerationFlow(input)
  ),
  [Services.executeTest]: fromPromise<TestResult, TestExecutionParams>(
    async ({ input }) => testExecutionFlow(input)
  ),
  [Services.fixTestFailure]: fromPromise<TestResult, FailureFixParams>(
    async ({ input }) => handleTestFailureFlow(input)
  )
};
