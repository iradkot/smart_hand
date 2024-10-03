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
  filePathsString: string;
  additionalFilesContent?: Record<string, string>;
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
    testFileName,
    filePathsString,
    additionalFilesContent,
  } = params;

  // Generate additional files section if any
  let additionalFilesSection = '';
  if (additionalFilesContent && Object.keys(additionalFilesContent).length > 0) {
    additionalFilesSection = '### Additional Files Provided:\n';
    for (const [filePath, content] of Object.entries(additionalFilesContent)) {
      additionalFilesSection += `\n**${filePath}:**\n\`\`\`typescript\n${content}\n\`\`\`\n`;
    }
  }

  if (attempt === 1) {
    // First attempt: Generate initial test code
    return createTestFilePrompt({
      targetDirectory: directoryPath,
      targetFile: fileName,
      fileContent: fileContent,
      analyzedTestLibraries: JSON.stringify(analyzedPackageJson.testLibraries, null, 2),
      testExamples,
      filePathsString,
      additionalFilesSection,
    });
  } else {
    // Subsequent attempts: Use error messages to correct the test code
    return handleTestRunErrorPrompt({
      errorMessage: lastErrorMessage,
      generatedTestFile: testFileName,
      testCode: testCode,
      filePathsString,
      additionalFilesSection,
    });
  }
}
