import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StepState } from '../types';

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
  copyToClipboard: (directoryPath: string, option: string) => Promise<{ message: string; content: string }>;
}

// Use `create` here to define the Zustand store as a hook
export const useStore = create<StoreState>()(
  devtools((set) => ({
    currentStepId: 'ChooseOptions',
    stepState: {
      directoryPath: 'C:\\Users\\irad1\\projects\\smart_hand',
      option: '',
      message: '',
      copiedContent: '',
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
      set({
        stepState: {
          directoryPath: '',
          option: '',
          message: '',
          copiedContent: '',
        },
        isLoading: false,
        error: null,
      }),
    copyToClipboard: (directoryPath: string, option: string) =>
      new Promise((resolve, reject) => {
        set({ isLoading: true, error: null });
        window.electron.ipcRenderer
          .invoke('invoke-copying-process', directoryPath, option)
          .then((response: { message: string; content: string }) => {
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
