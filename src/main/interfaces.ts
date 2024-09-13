import {StartCopyingProcessResult} from "./fileOperations/types/interfaces";

export interface CopyingProcessArgs {
  message: string;
  content: StartCopyingProcessResult;
}

export interface TestCreationArgs {
  success: boolean;
  error?: string;
}

export interface PackageJsonReadResult {
  content: string;
  packageJsonPath: string;
}

export interface ErrorResult {
    error: string;
    details: string;
}
