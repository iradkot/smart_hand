// flows/testExecutionFlow.ts
import { TestExecutionParams, TestResult } from '../types';
import { executeTest } from '../utils/executionUtils';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests';
import * as path from 'path';
import fs from 'fs';

interface EnhancedTestExecutionParams extends TestExecutionParams {
  mockPaths?: string[];
  sessionId?: string;  // For AI assistance if needed
}

const analyzeTestFailure = async (error: any, testContent: string, sessionId: string): Promise<TestResult> => {
  const prompt = `Analyze this test failure and suggest fixes:
Error: ${error.message || JSON.stringify(error)}

Test Content:
${testContent}

Provide specific suggestions for fixing the test.`;

  const aiResponse = await generateTestFile(sessionId, 'error-analysis', prompt);
  
  return {
    success: false,
    errorMessage: error.message || JSON.stringify(error),
    needsAIAssistance: true,
    complexFailure: true,
    suggestedFixes: [aiResponse.content.testCode]
  };
};

export async function testExecutionFlow(params: EnhancedTestExecutionParams): Promise<TestResult> {
  const { packageManager, directoryPath, testFileName, mockPaths = [], sessionId } = params;

  // Validate mocks before execution
  for (const mockPath of mockPaths) {
    if (!fs.existsSync(mockPath)) {
      throw new Error(`Mock file not found: ${mockPath}`);
    }
  }

  try {
    // Execute the test
    const result = await executeTest(packageManager, directoryPath, testFileName);
    
    // If test passed, return success
    if (result.success) {
      return result;
    }

    // If test failed and we have sessionId, get AI assistance
    if (!result.success && sessionId) {
      const testPath = path.join(directoryPath, testFileName);
      const testContent = await fs.promises.readFile(testPath, 'utf8');
      
      return analyzeTestFailure(result.errorMessage || result.details, testContent, sessionId);
    }

    return result;
  } catch (error) {
    // Handle unexpected errors during execution
    if (sessionId) {
      return analyzeTestFailure(error, '', sessionId);
    }
    
    return {
      success: false,
      errorMessage: error.message || 'Test execution failed',
      needsAIAssistance: true
    };
  }
}
