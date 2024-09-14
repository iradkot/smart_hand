import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createUISlice } from './slices/uiSlice';
import { createProcessSlice } from './slices/processSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { StoreState } from './store.types';
import { createRehydrationSlice } from './slices/rehydrationSlice';

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createRehydrationSlice(set, get, api),
        ...createUISlice(set, get, api),
        ...createProcessSlice(set, get, api),
        ...createNavigationSlice(set, get, api),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          currentRoute: state.currentRoute,
          currentStepId: state.currentStepId,
          stepState: state.stepState,
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
