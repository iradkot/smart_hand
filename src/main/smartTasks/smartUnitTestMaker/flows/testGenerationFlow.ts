// flows/testGenerationFlow.ts
import { testGenerationPrompt } from '../prompts/testGenerationPrompt';
import { writeFileContent, generateTestFileName } from '../utils/fileUtils';
import {
  LlmClassificationResult,
  TestGenerationResult,
} from '../types';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests'

export async function testGenerationFlow(params: {
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  classification: LlmClassificationResult;
}): Promise<TestGenerationResult> {
  const { sessionId, directoryPath, fileName, fileContent, classification } = params;
  const testFileName = generateTestFileName(fileName);

  // Build the LLM prompt
  const prompt = testGenerationPrompt(fileContent, classification, testFileName);

  // Get response from LLM
  const aiResponse = await generateTestFile(sessionId, fileContent, prompt);

  // Write file
  await writeFileContent(directoryPath, testFileName, aiResponse.content.testCode);

  return {
    testFileName,
    testCode: aiResponse.content.testCode,
  };
}
