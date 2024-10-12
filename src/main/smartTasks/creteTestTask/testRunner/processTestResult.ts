import { TestResult, TestState } from '../types';
import {formatTestResultMessage} from "./formatTestResult";

export function processTestResult(testResult: TestResult, state: TestState): {
  isSuccess: boolean,
  errorMessage: string
} {
  const errorMessage = formatTestResultMessage(testResult);
  if (testResult.success) {
    console.log('Tests passed successfully.');
    console.log(`Passed: ${testResult.summary?.numPassedTests}`);
    console.log(`Failed: ${testResult.summary?.numFailedTests}`);
    console.log(`Pending: ${testResult.summary?.numPendingTests}`);
    state.lastErrorMessage = '';
    return { isSuccess: true, errorMessage };
  } else {
    console.error('Tests failed or encountered errors.');
    if (testResult.summary) {
      console.error(`Passed: ${testResult.summary.numPassedTests}`);
      console.error(`Failed: ${testResult.summary.numFailedTests}`);
      console.error(`Pending: ${testResult.summary.numPendingTests}`);
    }
    if (testResult.errorMessage) {
      console.error('Error Message:', testResult.errorMessage);
    }
    if (testResult.warnings && testResult.warnings.length > 0) {
      console.warn('Warnings:', testResult.warnings);
    }
    return { isSuccess: false, errorMessage };
  }
}
