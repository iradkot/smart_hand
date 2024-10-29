// src/main/smartTasks/smartUnitTestMaker/flows/createInitialTestFlow.ts

import { generateTestFileName } from '../utils/testFileNameUtils';
import { writeFile } from '../utils/fileUtils';

import { executeTest } from '../utils/executionUtils';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests';
import { TestMakerContext } from '../types';
import { initialPrompt } from 'src/main/smartTasks/smartUnitTestMaker/prompts'

export const createInitialTestFlow = async ({
                                              input,
                                            }: {
  input: TestMakerContext;
}) => {
  try {
    const prompt = initialPrompt({
      fileName: input.fileName,
      fileContent: input.fileContent,
      testExamples: input.testExamples,
    });

    const aiResponse = await generateTestFile(
      input.sessionId,
      input.fileContent,
      prompt
    );

    const { testCode } = aiResponse.content;

    const testFileName = generateTestFileName(input.fileName);

    await writeFile(input.directoryPath, testFileName, testCode);

    const testResult = await executeTest(
      input.packageManager,
      input.directoryPath,
      testFileName
    );

    return testResult;
  } catch (error) {
    throw error;
  }
};
