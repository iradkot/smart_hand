// createTestTask/types/testResult.types.ts

export interface TestResult {
  success: boolean;
  summary?: {
    numPassedTests: number;
    numFailedTests: number;
    numPendingTests: number;
    numTotalTests: number;
  };
  testResults?: Array<{
    testFilePath: string;
    status: 'passed' | 'failed' | 'skipped';
    failureMessages?: string[];
  }>;
  warnings?: string[];
  errorMessage?: string;
}
