import {
  COPYING_PROCESS_INVOKE,
  CREATE_AND_RUN_TEST_INVOKE,
  READ_PACKAGE_JSON_INVOKE
} from "./constants";
import { PackageJsonReadResult } from "../main/interfaces";
import {ContentNode} from "../types/pathHarvester.types";

// Define the argument types
interface CopyingProcessArgs {
  directoryPath: string;
  option: string; // Define the correct type for 'option'
}

interface TestCreationArgs {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  contentTree: ContentNode;
  packageJsonPath: string;
  instructions: string;
  packageJsonContent: string;
}

export const invokeCopyingProcess = async ({ directoryPath, option }: CopyingProcessArgs) => {
  return window.electron.ipcRenderer.invoke(COPYING_PROCESS_INVOKE, directoryPath, option);
};

export const invokeCreateAndRunTest = async ({ sessionId, directoryPath, fileContent, fileName, contentTree, packageJsonPath, packageJsonContent }: TestCreationArgs) => {
  return window.electron.ipcRenderer.invoke(CREATE_AND_RUN_TEST_INVOKE, sessionId, directoryPath, fileContent, fileName, contentTree, packageJsonPath, packageJsonContent);
};

export const invokeReadPackageJson = (directoryPath: string): Promise<PackageJsonReadResult> => {
  return window.electron.ipcRenderer.invoke(READ_PACKAGE_JSON_INVOKE, directoryPath);
};
