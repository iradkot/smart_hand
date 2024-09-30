// src/main/smartTasks/createTestTask/helpers/createPrompt.ts

import { createTestFilePrompt, handleTestRunErrorPrompt } from '../../../../prompts/createTestFile.prompts';
import { AnalyzePackageJsonContent } from '../../../../api/requests/aiOperationsRequests';

interface PromptParams {
  attempt: number;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  analyzedPackageJson: AnalyzePackageJsonContent;
  testExamples: any;
  testCode: string;
  lastErrorMessage: string;
  testFileName: string;
}

export function createPrompt(params: PromptParams): string {
  const {
    attempt,
    directoryPath,
    fileName,
    fileContent,
    analyzedPackageJson,
    testExamples,
    testCode,
    lastErrorMessage,
    testFileName
  } = params;

  if (attempt === 1) {
    // First attempt: Generate initial test code
    return createTestFilePrompt({
      targetDirectory: directoryPath,
      targetFile: fileName,
      fileContent: fileContent,
      analyzedTestLibraries: JSON.stringify(analyzedPackageJson.testLibraries, null, 2),
      testExamples
    });
  } else {
    // Subsequent attempts: Use error messages to correct the test code
    return handleTestRunErrorPrompt({
      errorMessage: lastErrorMessage,
      generatedTestFile: testFileName,
      testCode: testCode
    });
  }
}
