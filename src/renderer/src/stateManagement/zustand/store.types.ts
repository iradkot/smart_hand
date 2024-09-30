import { StepState } from '../../types';
import { copiedContent } from '../../../../types/pathHarvester.types';

export interface UISlice {
  isLoading: boolean;
  error: string | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface ProcessSlice {
  currentStepId: string;
  stepState: StepState;
  step: number;
  setStep: (step: number) => void;
  setCurrentStepId: (stepId: string) => void;
  setStepState: (stepState: StepState) => void;
  resetProcess: () => void;
  copyToClipboard: (
    directoryPath: string,
    option: string
  ) => Promise<{ message: string; content: copiedContent }>;
  initializeSession: () => string;
}

export interface NavigationSlice {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

export interface RehydrationSlice {
  rehydrated: boolean;
  setRehydrated: (rehydrated: boolean) => void;
}

export interface CreateTestSectionSlice {
    testStatus: string | null;
    selectedFile: string[];
    isPending: boolean;
    packageJsonContent: string | null;
    packageJsonPath: string | null;
    setTestStatus: (status: string | null) => void;
    setSelectedFile: (files: string[]) => void;
    setIsPending: (pending: boolean) => void;
    setPackageJsonContent: (content: string | null) => void;
    setPackageJsonPath: (path: string | null) => void;
}

export type StoreState = UISlice & ProcessSlice & NavigationSlice &RehydrationSlice & CreateTestSectionSlice;
