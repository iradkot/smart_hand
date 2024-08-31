import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {OptionValue, StepState} from '../../types';
import {invokeCopyingProcess} from "../../../../invokers/ipcInvokers";
import {generateUniqueSessionId} from "../../../../utils/generateUniqueSessionId";
import {copiedContent} from "../../../../types/pathHarvester.types";

interface StoreState {
  currentStepId: string;
  stepState: StepState;
  step: number;
  isLoading: boolean;
  error: string | null;
  setStep: (step: number) => void;
  setCurrentStepId: (stepId: string) => void;
  setStepState: (stateAction: StepState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetProcess: () => void;
  copyToClipboard: (directoryPath: string, option: string) => Promise<{ message: string; content: copiedContent }>;
  initializeSession: () => string;
}

export const useStore = create<StoreState>()(
  devtools((set) => ({
    currentStepId: 'ChooseOptions',
    stepState: {
      directoryPath: 'C:\\Users\\irad1\\projects\\smart_hand\\src\\main\\fileOperations\\FileSystemHarvester',
      option: '' as OptionValue, // Ensure this matches the expected type
      message: '',
      copiedContent: {
        folderStructure: '', // Initialize with empty strings or appropriate default values
        ignoredFiles: '',
        contentTree: {}, // Initialize as an empty array or undefined if not needed initially
      },
    },
    initializeSession: () => {
      const sessionId = generateUniqueSessionId(); // Generate a new sessionId
      set((state) => ({
        stepState: {
          ...state.stepState,
          sessionId, // Set the new sessionId
        },
      }));
      return sessionId;
    },
    step: 1,
    isLoading: false,
    error: null,
    setStep: (step: number) => set({ step }),
    setCurrentStepId: (stepId: string) => set({ currentStepId: stepId }),
    setStepState: (stateAction: StepState) => set({ stepState: stateAction }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    resetProcess: () =>
      set(() => ({
        stepState: {
          directoryPath: '',
          option: '' as OptionValue, // Ensure option is properly reset
          message: '',
          copiedContent: {
            folderStructure: '',
            ignoredFiles: '',
            contentTree: {} // Or undefined if not required at initialization
          },
        },
        isLoading: false,
        error: null,
      })),
    copyToClipboard: (directoryPath: string, option: string) =>
      new Promise((resolve, reject) => {
        set({ isLoading: true, error: null });
        invokeCopyingProcess({ directoryPath, option })
          .then((response: { message: string; content: copiedContent }) => {
            console.log({ response });
            set((state) => ({
              stepState: {
                ...state.stepState,
                message: response.message,
                copiedContent: response.content,
              },
              isLoading: false,
            }));
            resolve(response);
          })
          .catch((err: { message: any }) => {
            set({
              isLoading: false,
              error: `Error: ${err.message}`,
            });
            reject(err);
          });
      }),
  }))
);


