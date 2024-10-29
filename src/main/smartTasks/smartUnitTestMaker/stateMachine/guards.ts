// src/main/smartTasks/smartUnitTestMaker/stateMachine/guards.ts

import { TestMakerContext } from '../types';

export const testPassed = ({ context }: { context: TestMakerContext }) =>
  !!(context.testResult && context.testResult.success);

export const canRetry = ({ context }: { context: TestMakerContext }) =>
  !context.testResult?.success && context.retries < context.maxRetries;

export const cannotRetry = ({ context }: { context: TestMakerContext }) =>
  !context.testResult?.success && context.retries >= context.maxRetries;
