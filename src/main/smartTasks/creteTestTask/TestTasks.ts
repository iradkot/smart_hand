// src/main/smartTasks/createTestTask/createAndRunTest.ts

import { analyzeProject } from './analyzeProject';
import { generateAndRunTests } from './generateAndRunTests';
import { mapProjectType } from './helpers/mapProjectType';
import { FileHandler } from '../../fileOperations/utils/FileHandler';
import { detectPackageManager, getTypeScriptVersion } from '../../utils/packageUtils';
import { AnalyzePackageJsonContent } from '../../../api/requests/aiOperationsRequests';
import {ContentNode} from "../../../types/pathHarvester.types";

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  packageJsonPath: string,
  instructions?: string,
  contentTree: ContentNode,
  packageJsonContent?: string
): Promise<void> {
  try {
    const projectPath = packageJsonPath.replace('package.json', '');

    // Step 1: Analyze the project
    const analyzedPackageJson = await analyzeProject(sessionId, packageJsonContent);
    const projectType = mapProjectType(analyzedPackageJson.projectType);

    if (projectType === 'unknown') {
      console.warn('Project type is unknown. Skipping test setup verification.');
      return;
    }

    // Step 2: Setup Testing Environment
    const tsVersionRaw = getTypeScriptVersion(packageJsonPath);
    const packageManager = detectPackageManager(projectPath);

    if (!tsVersionRaw) {
      console.warn('Test setup was skipped due to missing TypeScript version. Halting test generation.');
      return;
    }

    const fileHandler = new FileHandler();

    // Step 3: Generate and run tests with retries
    const testResult = await generateAndRunTests({
      sessionId,
      directoryPath,
      fileContent,
      fileName,
      contentTree,
      projectPath,
      packageManager,
      analyzedPackageJson,
      fileHandler,
      maxRetries: 3
    });

    if (!testResult.success) {
      throw new Error('Failed to generate passing tests after maximum retries');
    }
  } catch (error) {
    console.error('Error in createAndRunTest:', error);
    throw error;
  }
}
