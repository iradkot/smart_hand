// src/stateManagement/zustand/useStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createUISlice } from './slices/uiSlice';
import { createProcessSlice } from './slices/processSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createRehydrationSlice } from './slices/rehydrationSlice';
import { createCreateTestSectionSlice } from './slices/createTestSectionSlice';
import {StoreState, XStateUpdate} from "./store.types";
import {AnyMachineSnapshot} from "xstate";

/**
 * Initialize the Zustand store with devtools and persist middleware.
 * - `persist` is configured to store only specific slices of the state.
 * - `devtools` allows state inspection and debugging.
 */
export const useStore = create<StoreState>()(
  persist(
    devtools(
      (set, get, api) => ({
        // Persisted slices
        ...createRehydrationSlice(set, get, api),
        ...createProcessSlice(set, get, api),
        ...createNavigationSlice(set, get, api),
        ...createCreateTestSectionSlice(set, get, api),
        // Non-persisted slice containing transient UI states
        xStateCurrent: null,
        xStateHistory: [],
        setXStateCurrent: (state: AnyMachineSnapshot) => set({ xStateCurrent: state }),
        addXStateToHistory: (update: XStateUpdate) =>
          set((prev) => ({ xStateHistory: [...prev.xStateHistory, update] })),
        resetXStateHistory: () => set({ xStateHistory: [] }),
        ...createUISlice(set, get, api),
      }),
      {
        name: 'zustand-devtools', // Optional: Customize devtools name
      }
    ),
    {
      name: 'app-storage', // Unique name for localStorage key

      /**
       * partialize allows us to specify which parts of the state should be persisted.
       * Excludes `isLoading` and `error` to keep them transient.
       */
      partialize: (state) => ({
        currentRoute: state.currentRoute,
        currentStepId: state.currentStepId,
        stepState: state.stepState,
        // Persisted slices from CreateTestSectionSlice
        testStatus: state.testStatus,
        selectedFile: state.selectedFile,
        packageJsonContent: state.packageJsonContent,
        packageJsonPath: state.packageJsonPath,
        // Note: `isLoading`, 'isPending'  and `error` are intentionally excluded
      }),

      /**
       * onRehydrateStorage handles logic post-rehydration.
       * Since `set` isn't accessible here, we'll use a subscription to reset transient states.
       */
      onRehydrateStorage: ({ setRehydrated }) => {
        return (_state, error) => {
          if (error) {
            console.error('Error during rehydration:', error);
          } else {
            console.log('Rehydration complete: ', {
              currentRoute: _state?.currentRoute,
            });
            setRehydrated(true);
            // Transient states will be reset via subscription
          }
        };
      },
    }
  )
);
