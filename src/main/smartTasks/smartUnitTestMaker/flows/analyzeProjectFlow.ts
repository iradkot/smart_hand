// analyzeProjectFlow.ts

import { detectPackageManager } from '../utils/fileUtils';
import { analyzePackageJson } from 'src/api/requests/aiOperationsRequests';
import { TestMakerContext } from '../types';

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
    throw error;
  }
};
