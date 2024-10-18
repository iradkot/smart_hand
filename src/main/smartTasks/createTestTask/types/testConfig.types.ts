import {AnalyzedPackageJsonData} from "../../../../api/requests/aiOperationsRequests";
import {ContentNode} from "../../../../types/pathHarvester.types";

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
