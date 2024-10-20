// testRunner/formatTestResult.ts

import { TestResult } from '../types';

export function formatTestResultMessage(testResult: TestResult): string {
  const { summary, testResults } = testResult;
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
        message += `\n**Test File:** ${test.testFilePath}\n`;

        // Each failure message should be included in the output
        if (test.failureMessages) {
          test.failureMessages.forEach(failureMessage => {
            const simplifiedMessage = simplifyErrorMessage(failureMessage);
            message += `\n\`\`\`\n${simplifiedMessage}\n\`\`\`\n`;
          });
        }
      });
    }
  }

  if (testResult.errorMessage) {
    const simplifiedError = simplifyErrorMessage(testResult.errorMessage);
    message += `\n**Error Message:**\n\`\`\`\n${simplifiedError}\n\`\`\`\n`;
  }

  // Confirm success if no failures
  if (testResult.success) {
    message = `All tests passed successfully.`;
  }

  return message.trim();
}

function simplifyErrorMessage(errorMessage: string): string {
  const lines = errorMessage.split('\n');

  // Filter out lines from node_modules and irrelevant paths
  const relevantLines = lines.filter(line => {
    const trimmedLine = line.trim();
    return (
      !trimmedLine.includes('node_modules') &&
      (trimmedLine.includes('/src/') || trimmedLine.includes('at ')) &&
      trimmedLine !== ''
    );
  });

  const maxStackTraceDepth = 5;
  return relevantLines.slice(0, maxStackTraceDepth).join('\n');
}
