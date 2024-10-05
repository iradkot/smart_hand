// createTestTask/prompts/buildPrompt.ts
import { TestConfig, TestState } from '../types';
import { formatAdditionalFiles } from '../fileHandlers/formatAdditionalFiles';
import {createTestFilePrompt, handleTestRunErrorPrompt} from "../../../../prompts/createTestFile.prompts";

export function buildPrompt(
  config: TestConfig,
  state: TestState,
  testExamples: string,
  filePathsString: string,
  attempt: number
): string {
  const additionalFilesSection = formatAdditionalFiles(state.additionalFilesContent);

  if (attempt === 1) {
    return createTestFilePrompt({
      targetDirectory: config.directoryPath,
      targetFile: config.fileName,
      fileContent: config.fileContent,
      analyzedTestLibraries: JSON.stringify(config.analyzedPackageJson.testLibraries, null, 2),
      testExamples,
      filePathsString,
      additionalFilesSection,
    });
  } else {
    return handleTestRunErrorPrompt({
      errorMessage: state.lastErrorMessage,
      generatedTestFile: state.testFileName,
      testCode: state.testCode,
      filePathsString,
      additionalFilesSection,
    });
  }
}
