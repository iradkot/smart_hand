// createTestTask/types/testConfig.types.ts

import { ContentNode } from './contentNode.types';
import {AnalyzedPackageJsonData} from "../../../../api/requests/aiOperationsRequests";

export interface TestConfig {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  contentTree: ContentNode;
  projectPath: string;
  packageManager: string;
  analyzedPackageJson: AnalyzedPackageJsonData;
  maxRetries: number;
}
