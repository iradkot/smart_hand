// utils/executionUtils.ts

import { exec } from 'child_process';
import { TestResult } from '../types';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests';
const stripAnsi = require('strip-ansi');
import * as path from 'path';
import { promises as fs } from 'fs';

interface ExecutionContext {
  complexity?: number;
  hasAsyncOperations?: boolean;
  sessionId?: string;
  mockPaths?: string[];
}

const analyzeFailure = async (error: Error | string, context: ExecutionContext): Promise<TestResult> => {
  const errorStr = error instanceof Error ? error.message : error;
  let needsAIAssistance = false;
  let complexFailure = false;

  // Check if error is complex enough for AI
  if (
    context.complexity && context.complexity > 5 ||
    context.hasAsyncOperations ||
    errorStr.includes('async') ||
    errorStr.includes('timeout') ||
    errorStr.includes('undefined') ||
    errorStr.toLowerCase().includes('expect')
  ) {
    needsAIAssistance = true;
    complexFailure = true;
  }

  // If we have a session ID and need AI, get suggestions
  if (needsAIAssistance && context.sessionId) {
    const prompt = `Analyze this test failure and provide specific fixes:
Error: ${errorStr}

Key points to consider:
- Is this an async timing issue?
- Are all mocks properly set up?
- Are there any undefined values?
- Is the test expectation correct?

Please provide specific suggestions for fixing the test.`;

    const aiResponse = await generateTestFile(context.sessionId, 'error-analysis', prompt);
    return {
      success: false,
      errorMessage: errorStr,
      needsAIAssistance,
      complexFailure,
      suggestedFixes: [aiResponse.content.testCode]
    };
  }

  return {
    success: false,
    errorMessage: errorStr,
    needsAIAssistance,
    complexFailure
  };
};

/**
 * Executes a test with integrated local and AI assistance
 */
export async function executeTest(
  packageManager: string,
  directoryPath: string,
  testFileName: string,
  context: ExecutionContext = {}
): Promise<TestResult> {
  return new Promise((resolve) => {
    const command = buildTestCommand(packageManager, testFileName);
    
    exec(command, { cwd: directoryPath }, async (error, stdout, stderr) => {
      if (error) {
        try {
          // Try reading jest-results.json if available
          const resultsPath = path.join(directoryPath, 'jest-results.json');
          const resultsContent = await fs.readFile(resultsPath, 'utf8');
          const results = JSON.parse(resultsContent);

          // Analyze the failure with context
          resolve(await analyzeFailure(results, context));
        } catch (readError) {
          // Handle raw error output
          resolve(await analyzeFailure(stderr || error.message, context));
        }
      } else {
        resolve({ success: true });
      }
    });
  });
}

function buildTestCommand(packageManager: string, testFileName: string): string {
  const testCommand = packageManager === 'yarn' ? 'yarn test' : 'npm test';
  return `${testCommand} -- ${testFileName} --json --outputFile=jest-results.json`;
}
