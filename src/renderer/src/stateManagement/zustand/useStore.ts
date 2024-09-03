import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OptionValue, StepState } from '../../types';
import { invokeCopyingProcess } from "../../../../invokers/ipcInvokers";
import { generateUniqueSessionId } from "../../../../utils/generateUniqueSessionId";
import { contentTree, copiedContent } from "../../../../types/pathHarvester.types";
import {handleError} from "../../../../utils/ErrorHandler";

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
      directoryPath: 'C:\\Users\\irad1\\projects\\smart_hand\\src\\renderer\\src\\screens\\status',
      option: '' as OptionValue,
      message: '',
      copiedContent: {
        folderStructure: '',
        ignoredFiles: '',
        type: 'directory',
        localPath: '',
        children: {} as contentTree,
      },
    },
    initializeSession: () => {
      const sessionId = generateUniqueSessionId();
      set((state) => ({
        stepState: {
          ...state.stepState,
          sessionId,
        },
      }));
      return sessionId;
    },
    step: 1,
    isLoading: false,
    error: null,

    setStep: (step) => set({ step }),
    setCurrentStepId: (stepId) => set({ currentStepId: stepId }),
    setStepState: (stepState) => set({ stepState }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    resetProcess: () =>
      set(() => ({
        stepState: {
          directoryPath: '',
          option: '' as OptionValue,
          message: '',
          copiedContent: {
            folderStructure: '',
            ignoredFiles: '',
            type: 'directory',
            localPath: '',
            children: {} as contentTree,
          },
        },
        isLoading: false,
        error: null,
      })),

    copyToClipboard: async (directoryPath, option) => {
      set({ isLoading: true, error: null });

      try {
        const response = await invokeCopyingProcess({ directoryPath, option });
        console.log({ response });

        set((state) => ({
          stepState: {
            ...state.stepState,
            message: response.message,
            copiedContent: response.content,
          },
          isLoading: false,
        }));

        return response;
      } catch (err) {
        set({
          isLoading: false,
          error: `Error: ${handleError(err, 'Error in copyToClipboard')}`,
        });

        throw err;
      }
    },
  }))
);
