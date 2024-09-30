// src/main/smartTasks/createTestTask/types/TestGenerationParams.ts

import { AnalyzePackageJsonContent } from '../../../../api/requests/aiOperationsRequests';
import { FileHandler } from '../../../fileOperations/utils/FileHandler';
import {ContentNode} from "../../../../types/pathHarvester.types";

export interface TestGenerationParams {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  contentTree: ContentNode;
  projectPath: string;
  packageManager: string;
  analyzedPackageJson: AnalyzePackageJsonContent;
  fileHandler: FileHandler;
  maxRetries: number;
}
