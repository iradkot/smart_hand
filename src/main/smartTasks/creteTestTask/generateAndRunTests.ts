// src/main/smartTasks/createTestTask/generateAndRunTests.ts

import { generateTestFile } from '../../../api/requests/aiOperationsRequests';
import {CommandError, runCommand} from '../../utils/commandRunner';
import { createPrompt } from './helpers/createPrompt';
import { createTestFileName, updateTestFileName } from './helpers/fileNameUtils';
import { getTestExamples } from './utils/getTestExamples';
import { TestGenerationParams, TestGenerationResult } from './types';
import determineIfContentIsTsx from "./utils/determineIfContentIsTsx";
import {
  generateSimplifiedFilePaths,
} from "../../../utils/harvesterUtils/harvesterUtils";
import {findFilesInNode} from "../../../utils/harvesterUtils/findFilesInNode/findFilesInNode";

export async function generateAndRunTests(params: TestGenerationParams): Promise<TestGenerationResult> {
  const {
    sessionId,
    directoryPath,
    fileContent,
    fileName,
    contentTree,
    projectPath,
    packageManager,
    analyzedPackageJson,
    fileHandler,
    maxRetries,
  } = params;

  let testCode = '';
  let testFileName = createTestFileName(fileName);
  let lastErrorMessage = '';

  const testExamples = await getTestExamples();
  const simplifiedFilePaths   = generateSimplifiedFilePaths(contentTree);
  const filePathsString = simplifiedFilePaths.join('\n');

  let additionalFilesContent: Record<string, string> = {};

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt} of ${maxRetries}`);

    // Generate the prompt
    const prompt = createPrompt({
      attempt,
      directoryPath,
      fileName,
      fileContent,
      analyzedPackageJson,
      testExamples,
      testCode,
      lastErrorMessage,
      testFileName,
      filePathsString,
      additionalFilesContent, // Include additional files
    });

    // Generate or correct test code
    console.log(`createTestFilePrompt (attempt ${attempt}):`, prompt);
    const testResponse = await generateTestFile(sessionId, fileContent, prompt);

    const { content } = testResponse;
    testCode = content.testCode;

    if (content.requestedFiles && content.requestedFiles.length > 0) {
      console.log('Requested files:', content.requestedFiles);
      additionalFilesContent = findFilesInNode(content.requestedFiles, contentTree);
      // additionalFilesContent = getFilesContent({
      //   node: contentTree,
      //   targetPaths: content.requestedFiles,
      //   rootPath: projectPath,
      // });
      console.log('length of additionalFilesContent:', Object.keys(additionalFilesContent).length);
    }

    // Determine file extension and update file name
    const testFileEnding = determineIfContentIsTsx(testCode) ? 'tsx' : 'ts';
    testFileName = updateTestFileName(testFileName, testFileEnding);
    const testFilePath = `${directoryPath}/${attempt}_${testFileName}`;

    console.log(`Generated test code (attempt ${attempt}):`, testCode);

    // Write test file and prompt to disk
    await fileHandler.writeFile(testFilePath, testCode);
    await fileHandler.writeFile(`${directoryPath}/${attempt}_prompt.txt`, prompt);

    // Run tests
    const runTestCommand = `${packageManager} test --runTestsByPath ${testFilePath}`;

    try {
      const { stdout, stderr } = await runCommand(runTestCommand, projectPath);
      console.log('Test command output:', stdout);

      if (stderr) {
        console.error('Test command error output:', stderr);
        lastErrorMessage = stderr;
        continue;
      }

      // Tests passed
      console.log('Tests passed successfully');
      return { success: true };
    } catch (error: any) {
      const commandError = error as CommandError;
      console.error('Error in test execution:', commandError);
      lastErrorMessage = commandError.stderr || commandError.message || 'Unknown error';
    }
  }

  return { success: false };
}
