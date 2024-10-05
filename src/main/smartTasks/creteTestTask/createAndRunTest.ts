// createTestTask/createAndRunTest.ts

import { analyzeProject } from './analysis/analyzeProject';
import { loadTestExamples } from './examples/loadTestExamples';
import { buildPrompt } from './prompts/buildPrompt';
import { generateTestCode } from './generation/generateTestCode';
import { executeTests } from './execution/executeTests';
import { createTestFileName, updateTestFileName } from './fileHandlers/testFileNameGenerator';
import { writeTestFile } from './fileHandlers/writeTestFile';
import { writePromptFile } from './fileHandlers/writePromptFile';
import { inferFileExtension } from './utils/inferFileExtension';
import { TestConfig, TestState } from './types';
import {generateSimplifiedFilePaths} from "../../../utils/harvesterUtils/harvesterUtils";
import {ContentNode} from "../../../types/pathHarvester.types";
import {detectPackageManager} from "../../utils/packageUtils";

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
  const maxRetries = 5;
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

    await writeTestFile(config.directoryPath, `${testFileName}`, state.testCode);
    await writePromptFile(config.directoryPath, `${attempt}_prompt.txt`, prompt);

    const testResult = await executeTests(config.packageManager, config.projectPath, testFilePath);

    if (testResult.success) {
      console.log('Tests passed successfully.');
      return;
    } else {
      state.lastErrorMessage = testResult.errorMessage || '';
    }
  }

  throw new Error('Failed to generate passing tests after maximum retries.');
}
