// analyzeProjectFlow.ts

import { detectPackageManager } from '../utils/fileUtils';
import { analyzePackageJson } from 'src/api/requests/aiOperationsRequests';
import { TestMakerContext } from '../types';
import { handleError } from 'src/utils/ErrorHandler'

export const analyzeProjectFlow = async ({
                                           input,
                                         }: {
  input: TestMakerContext;
}) => {
  try {
    const analyzedPackageJsonResponse = await analyzePackageJson(
      input.sessionId,
      input.packageJsonContent
    );

    const analyzedPackageJson = analyzedPackageJsonResponse.content;

    const packageManager = detectPackageManager(input.directoryPath);

    return {
      analyzedPackageJson,
      packageManager,
    };
  } catch (error) {
    const errorMessage = handleError(error, 'analyzeProjectFlow');
    throw new Error(errorMessage);
  }
};
