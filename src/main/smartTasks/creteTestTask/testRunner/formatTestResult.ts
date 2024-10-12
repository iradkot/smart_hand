import {TestResult} from "../types";

export function formatTestResultMessage(testResult: TestResult): string {
  const { summary, testResults, warnings, errorMessage } = testResult;
  let message = '';

  if (summary) {
    message += `**Test Summary:**\n`;
    message += `- Passed: ${summary.numPassedTests}\n`;
    message += `- Failed: ${summary.numFailedTests}\n`;
    message += `- Pending: ${summary.numPendingTests}\n`;
    message += `- Total: ${summary.numTotalTests}\n\n`;
  }

  if (testResults && testResults.length > 0) {
    const failedTests = testResults.filter(result => result.status === 'failed');
    if (failedTests.length > 0) {
      message += `**Failed Tests:**\n`;
      failedTests.forEach(test => {
        message += `- **${test.testFilePath}**\n`;
        if (test.failureMessages && test.failureMessages.length > 0) {
          test.failureMessages.forEach((failMsg, index) => {
            message += `  ${index + 1}. ${failMsg}\n`;
          });
        }
      });
      message += `\n`;
    }
  }

  if (warnings && warnings.length > 0) {
    message += `**Warnings:**\n`;
    warnings.forEach((warning) => {
      message += `- ${warning}\n`;
    });
    message += `\n`;
  }

  if (errorMessage) {
    message += `**Error Message:**\n${errorMessage}\n`;
  }

  // If all tests passed and no warnings, provide a confirmation message
  if (testResult.success && (!warnings || warnings.length === 0)) {
    message = `All tests passed successfully.`;
  }

  return message.trim(); // Remove any trailing whitespace
}
