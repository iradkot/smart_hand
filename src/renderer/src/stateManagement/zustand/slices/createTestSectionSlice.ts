// src/stateManagement/zustand/slices/createTestSectionSlice.ts
import { StateCreator } from 'zustand';

interface CreateTestSectionState {
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

export const createCreateTestSectionSlice: StateCreator<
  CreateTestSectionState,
  [],
  [],
  CreateTestSectionState
> = (set) => ({
  testStatus: null,
  selectedFile: [],
  isPending: false,
  packageJsonContent: null,
  packageJsonPath: null,
  setTestStatus: (status) => set({ testStatus: status }),
  setSelectedFile: (files) => set({ selectedFile: files }),
  setIsPending: (pending) => set({ isPending: pending }),
  setPackageJsonContent: (content) => set({ packageJsonContent: content }),
  setPackageJsonPath: (path) => set({ packageJsonPath: path }),
});
