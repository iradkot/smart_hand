// flows/testGenerationFlow.ts
import { testGenerationPrompt } from '../prompts/testGenerationPrompt';
import { writeFileContent, generateTestFileName } from '../utils/fileUtils';
import { processMockDependencies } from './mockDependencyFlow';
import {
  LlmClassificationResult,
  TestGenerationResult,
  MockDefinition
} from '../types';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests';
import * as path from 'path';

export async function testGenerationFlow(params: {
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  classification: LlmClassificationResult;
}): Promise<TestGenerationResult> {
  const { sessionId, directoryPath, fileName, fileContent, classification } = params;
  const testFileName = generateTestFileName(fileName);

  // Process mocks with dependency handling
  const mockRequests = classification.mocksNeeded.map(modulePath => ({
    modulePath,
    content: classification.suggestedMockContent?.[modulePath]
  }));

  // Generate all required mocks in correct dependency order
  const generatedMocks = await processMockDependencies(
    sessionId,
    directoryPath,
    mockRequests
  );

  // Build the test generation prompt with mock information
  const prompt = testGenerationPrompt({
    fileContent,
    classification,
    testFileName,
    mocks: generatedMocks,
    complexityAnalysis: {
      hasHooks: fileContent.includes('use'),
      hasContext: fileContent.includes('Context'),
      hasEffects: fileContent.includes('Effect'),
      complexImports: classification.complexityLevel && classification.complexityLevel > 2
    }
  });

  // Get response from LLM for the test file
  const aiResponse = await generateTestFile(sessionId, fileContent, prompt);

  // Write test file
  await writeFileContent(directoryPath, testFileName, aiResponse.content.testCode);

  const validationPoints = [];
  if (generatedMocks.length > 0) {
    validationPoints.push('Verify mock dependencies are properly loaded');
  }
  if (fileContent.includes('async')) {
    validationPoints.push('Verify async operations are properly handled');
  }

  return {
    testFileName,
    testCode: aiResponse.content.testCode,
    generatedMocks,
    validationPoints,
    needsAIReview: classification.complexityLevel && classification.complexityLevel > 3
  };
}
