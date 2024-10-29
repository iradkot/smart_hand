// src/main/smartTasks/smartUnitTestMaker/flows/handleTestFailureFlow.ts

import { readFile, writeFile } from '../utils/fileUtils';
import { executeTest } from '../utils/executionUtils';
import { generateTestFileName } from '../utils/testFileNameUtils';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests';
import { TestMakerContext } from '../types';
import { errorHandlingPrompt } from 'src/main/smartTasks/smartUnitTestMaker/prompts'

export const handleTestFailureFlow = async ({
                                              input,
                                            }: {
  input: TestMakerContext;
}) => {
  try {
    const testFileName = generateTestFileName(input.fileName);
    const previousTestCode = await readFile(input.directoryPath, testFileName);

    const prompt = errorHandlingPrompt({
      previousTestCode,
      errorMessage: input.testResult?.errorMessage || '',
    });

    const aiResponse = await generateTestFile(
      input.sessionId,
      input.fileContent,
      prompt
    );

    const { testCode } = aiResponse.content;

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
