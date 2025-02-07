// flows/handleTestFailureFlow.ts
import { readFileContent, writeFileContent } from '../utils/fileUtils';
import { errorHandlingPrompt } from '../prompts/errorHandlingPrompt';
import { TestResult } from '../types';
import { executeTest } from '../utils/executionUtils';
import {generateTestFile} from "src/api/requests/aiOperationsRequests";

export async function handleTestFailureFlow(params: {
  sessionId: string;
  directoryPath: string;
  testFileName: string;
  lastError: string;
  packageManager: string;
}): Promise<TestResult> {
  const { sessionId, directoryPath, testFileName, lastError, packageManager } = params;

  // 1. read existing test code
  const oldTestCode = await readFileContent(directoryPath, testFileName);

  // 2. build prompt with error info
  const prompt = errorHandlingPrompt({
    previousTestCode: oldTestCode,
    errorMessage: lastError,
  });

  // 3. re-generate the test code
  const aiResponse = await generateTestFile(sessionId, oldTestCode, prompt);

  // 4. write the updated test code
  await writeFileContent(directoryPath, testFileName, aiResponse.content.testCode);

  // 5. re-run the test
  return executeTest(packageManager, directoryPath, testFileName);
}
