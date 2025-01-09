// src/stateManagement/zustand/useStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Import your custom storage
import { createCompressedStorage } from '../../utils/createCompressedStorage'

// Import your slices...
import { createUISlice } from './slices/uiSlice'
import { createProcessSlice } from './slices/processSlice'
import { createNavigationSlice } from './slices/navigationSlice'
import { createRehydrationSlice } from './slices/rehydrationSlice'
import { createCreateTestSectionSlice } from './slices/createTestSectionSlice'

import { StoreState } from './store.types'

export const useStore = create<StoreState>()(
  persist(
    devtools((set, get, api) => ({
      // --- Persisted slices
      ...createRehydrationSlice(set, get, api),
      ...createProcessSlice(set, get, api),
      ...createNavigationSlice(set, get, api),
      ...createCreateTestSectionSlice(set, get, api),

      // --- Non-persisted (transient) xState stuff
      xStateCurrent: null,
      xStateHistory: [],
      setXStateCurrent: (state) => set({ xStateCurrent: state }),
      addXStateToHistory: (update) =>
        set((prev) => ({ xStateHistory: [...prev.xStateHistory, update] })),
      resetXStateHistory: () => set({ xStateHistory: [] }),

      // --- UI slice
      ...createUISlice(set, get, api),
    })),
    {
      /**
       * Options for `persist` below
       */
      name: 'app-storage', // The key in storage
      storage: createCompressedStorage(() => localStorage),
      partialize: (state) => ({
        // Choose which parts of the store are persisted
        currentRoute: state.currentRoute,
        currentStepId: state.currentStepId,
        stepState: state.stepState,
        testStatus: state.testStatus,
        selectedFile: state.selectedFile,
        packageJsonContent: state.packageJsonContent,
        packageJsonPath: state.packageJsonPath,
      }),
      onRehydrateStorage: ({ setRehydrated }) => {
        return (persistedState, error) => {
          if (error) {
            console.error('Error during rehydration:', error)
          } else {
            console.log('Rehydration complete: ', {
              currentRoute: persistedState?.currentRoute,
            })
            setRehydrated(true)
          }
        }
      },
    }
  )
)
