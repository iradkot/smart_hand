// testRunner/processTestResult.ts

import { TestResult, TestState } from '../types';
import { formatTestResultMessage } from './formatTestResult';

export function processTestResult(testResult: TestResult, state: TestState): {
  isSuccess: boolean,
  errorMessage: string
} {
  const errorMessage = formatTestResultMessage(testResult);

  if (testResult.success) {
    console.log('Tests passed successfully.');
    state.lastErrorMessage = '';
    return { isSuccess: true, errorMessage };
  } else {
    console.error('Tests failed or encountered errors.');
    state.lastErrorMessage = errorMessage;
    return { isSuccess: false, errorMessage };
  }
}
