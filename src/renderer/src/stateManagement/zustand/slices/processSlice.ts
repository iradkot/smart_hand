// src/stateManagement/zustand/slices/processSlice.ts

import { StateCreator } from 'zustand';
import { ProcessSlice, StoreState } from '../store.types';
import { generateUniqueSessionId } from '../../../../../utils/generateUniqueSessionId';
import { handleError } from '../../../../../utils/ErrorHandler';
import { invokeCopyingProcess } from '../../../../../invokers/ipcInvokers';
import { initialStepState } from '../initialState';

export const createProcessSlice: StateCreator<
  StoreState,
  [],
  [],
  ProcessSlice
> = (set, get) => ({
  currentStepId: 'ChooseOptions',
  stepState: initialStepState,
  step: 1,

  setStep: (step) => set({ step }),
  setCurrentStepId: (stepId) => set({ currentStepId: stepId }),
  setStepState: (stepState) => set({ stepState }),
  resetProcess: () => set({ stepState: initialStepState }),

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

  copyToClipboard: async (directoryPath, option) => {
    get().setLoading(true);
    get().setError(null);

    try {
      const response = await invokeCopyingProcess({ directoryPath, option });
      console.log({ response });

      set((state) => ({
        stepState: {
          ...state.stepState,
          message: response.message,
          copiedContent: response.content,
        },
      }));

      get().setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = handleError(err, 'Error in copyToClipboard');
      get().setLoading(false);
      get().setError(`Error: ${errorMessage}`);
      throw err;
    }
  },
});
