import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createUISlice } from './slices/uiSlice';
import { createProcessSlice } from './slices/processSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createRehydrationSlice } from './slices/rehydrationSlice';
import { createCreateTestSectionSlice } from './slices/createTestSectionSlice';
import {StoreState} from "./store.types";

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createRehydrationSlice(set, get, api),
        ...createUISlice(set, get, api),
        ...createProcessSlice(set, get, api),
        ...createNavigationSlice(set, get, api),
        ...createCreateTestSectionSlice(set, get, api),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          currentRoute: state.currentRoute,
          currentStepId: state.currentStepId,
          stepState: state.stepState,
          // Include the createTestSection state for persistence
          testStatus: state.testStatus,
          selectedFile: state.selectedFile,
          isPending: state.isPending,
          packageJsonContent: state.packageJsonContent,
          packageJsonPath: state.packageJsonPath,
        }),
        onRehydrateStorage: ({ setRehydrated }) => {
          return (_state, error) => {
            if (error) {
              console.error('Error during rehydration:', error);
            } else {
              console.log('Rehydration complete: ', {
                currentRoute: _state?.currentRoute,
              });
              setRehydrated(true);
            }
          };
        },
      }
    )
  )
);
