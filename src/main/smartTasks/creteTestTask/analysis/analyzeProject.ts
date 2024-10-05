// createTestTask/analysis/analyzeProject.ts

import { mapProjectType } from './mapProjectType';
import {analyzePackageJson, AnalyzedPackageJsonData} from "../../../../api/requests/aiOperationsRequests";

export async function analyzeProject(
  sessionId: string,
  packageJsonContent: string
): Promise<{ analyzedPackageJson: AnalyzedPackageJsonData; projectType: string }> {
  const response = await analyzePackageJson(sessionId, packageJsonContent);
  const analyzedPackageJson = response.content as AnalyzedPackageJsonData;
  const projectType = mapProjectType(analyzedPackageJson.projectType);

  return { analyzedPackageJson, projectType };
}
