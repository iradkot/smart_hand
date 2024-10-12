// createTestTask/createAndRunTest.ts

import {analyzeProject} from './analysis/analyzeProject';
import {loadTestExamples} from './examples/loadTestExamples';
import {buildPrompt} from './prompts/buildPrompt';
import {generateTestCode} from './generation/generateTestCode';
import {createTestFileName, updateTestFileName} from './fileHandlers/testFileNameGenerator';
import {writeTestFile} from './fileHandlers/writeTestFile';
import {writePromptFile} from './fileHandlers/writePromptFile';
import {inferFileExtension} from './utils/inferFileExtension';
import {TestConfig, TestState} from './types';
import {generateSimplifiedFilePaths} from "../../../utils/harvesterUtils/harvesterUtils";
import {ContentNode} from "../../../types/pathHarvester.types";
import {detectPackageManager} from "../../utils/packageUtils";
import {processTestResult} from "./testRunner/processTestResult";
import {executeTests} from "./testRunner/executeTests";

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  packageJsonPath: string,
  contentTree: ContentNode,
  packageJsonContent: string
): Promise<void> {
  const projectPath = packageJsonPath.replace('package.json', '');
  const { analyzedPackageJson, projectType } = await analyzeProject(sessionId, packageJsonContent);

  if (projectType === 'unknown') {
    console.warn('Unknown project type. Skipping test generation.');
    return;
  }

  const packageManager = detectPackageManager(projectPath);
  const maxRetries = 3;
  const testExamples = await loadTestExamples();
  const simplifiedFilePaths = generateSimplifiedFilePaths(contentTree);
  const filePathsString = simplifiedFilePaths.join('\n');

  const config: TestConfig = {
    sessionId,
    directoryPath,
    fileContent,
    fileName,
    contentTree,
    projectPath,
    packageManager,
    analyzedPackageJson,
    maxRetries,
  };

  const state: TestState = {
    testCode: '',
    testFileName: createTestFileName(fileName),
    lastErrorMessage: '',
    additionalFilesContent: {},
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt} of ${maxRetries}`);

    const prompt = buildPrompt(config, state, testExamples, filePathsString, attempt);
    await generateTestCode(config.sessionId, prompt, config.fileContent, config.contentTree, state);

    const fileExtension = inferFileExtension(state.testCode);
    state.testFileName = updateTestFileName(state.testFileName, fileExtension);
    const testFileName = `${attempt}_${state.testFileName}`;
    const testFilePath = `${config.directoryPath}/${testFileName}`;

    await writeTestFile(config.directoryPath, testFileName, state.testCode);
    await writePromptFile(config.directoryPath, `${attempt}_prompt.txt`, prompt);

    const testResult = await executeTests(config.packageManager, config.projectPath, testFilePath);

    const processedTestResult = processTestResult(testResult, state);

    if (processedTestResult.isSuccess) {
      // Optionally, you can pass the error message to the prompt or another handler if needed
      console.log('Tests passed successfully.');
      return;
    } else {
      state.lastErrorMessage = processedTestResult.errorMessage;
      // The error message is already set in the state; proceed to the next attempt
      console.warn(`Attempt ${attempt} failed. Error Message:\n${state.lastErrorMessage}`);
    }
  }

  throw new Error('Failed to generate passing tests after maximum retries.');
}
