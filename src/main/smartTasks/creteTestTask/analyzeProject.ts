// src/main/smartTasks/createTestTask/analyzeProject.ts

import { analyzePackageJson, AnalyzePackageJsonContent } from '../../../api/requests/aiOperationsRequests';

export async function analyzeProject(
  sessionId: string,
  packageJsonContent?: string
): Promise<AnalyzePackageJsonContent> {
  const analyzedPackageJsonResponse = await analyzePackageJson(sessionId, packageJsonContent);
  return analyzedPackageJsonResponse.content as AnalyzePackageJsonContent;
}
