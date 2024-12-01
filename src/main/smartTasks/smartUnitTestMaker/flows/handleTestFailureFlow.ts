// handleTestFailureFlow.ts

import { readFile, writeFile } from '../utils/fileUtils';
import { executeTest } from '../utils/executionUtils';
import { generateTestFileName } from '../utils/testFileNameUtils';
import { generateTestFile } from 'src/api/requests/aiOperationsRequests';
import { TestMakerContext } from '../types';
import { errorHandlingPrompt } from 'src/main/smartTasks/smartUnitTestMaker/prompts';
import { handleError } from 'src/utils/ErrorHandler';
import { findFilesInNode } from 'src/utils/harvesterUtils/findFilesInNode/findFilesInNode';

export const handleTestFailureFlow = async ({
                                              input,
                                            }: {
  input: TestMakerContext;
}) => {
  try {
    const testFileName = generateTestFileName(input.fileName);
    const previousTestCode = await readFile(input.directoryPath, testFileName);

    let additionalFilesContent = '';

    // Process requested files from previous AI response
    if (input.requestedFiles && input.requestedFiles.length > 0) {
      const filesContentMap = findFilesInNode(input.requestedFiles, input.contentTree);
      for (const [filePath, content] of Object.entries(filesContentMap)) {
        additionalFilesContent += `File: ${filePath}\n\`\`\`typescript\n${content}\n\`\`\`\n\n`;
      }
    }

    const prompt = errorHandlingPrompt({
      previousTestCode,
      errorMessage: input.testResult?.errorMessage || '',
      additionalFiles: additionalFilesContent,
    });

    const aiResponse = await generateTestFile(
      input.sessionId,
      input.fileContent,
      prompt
    );

    const { testCode, requestedFiles } = aiResponse.content;

    // Update input with new requested files
    input.requestedFiles = requestedFiles || [];

    // If there are new requested files, recursively handle them
    if (input.requestedFiles.length > 0) {
      // Read the requested files
      const filesContentMap = findFilesInNode(input.requestedFiles, input.contentTree);
      additionalFilesContent = '';
      for (const [filePath, content] of Object.entries(filesContentMap)) {
        additionalFilesContent += `File: ${filePath}\n\`\`\`typescript\n${content}\n\`\`\`\n\n`;
      }

      // Update the prompt with the additional files
      const newPrompt = errorHandlingPrompt({
        previousTestCode: testCode,
        errorMessage: input.testResult?.errorMessage || '',
        additionalFiles: additionalFilesContent,
      });

      // Regenerate the test code with the additional files
      const newAiResponse = await generateTestFile(
        input.sessionId,
        input.fileContent,
        newPrompt
      );

      const { testCode: newTestCode } = newAiResponse.content;

      await writeFile(input.directoryPath, testFileName, newTestCode);
    } else {
      await writeFile(input.directoryPath, testFileName, testCode);
    }

    const testResult = await executeTest(
      input.packageManager,
      input.directoryPath,
      testFileName
    );

    return testResult;
  } catch (error) {
    const errorMsg = handleError(error, 'handleTestFailureFlow');
    throw new Error(errorMsg);
  }
};
