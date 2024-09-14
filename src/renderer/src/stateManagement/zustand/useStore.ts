// src/stateManagement/zustand/useStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createUISlice } from './slices/uiSlice';
import { createProcessSlice } from './slices/processSlice';
import { StoreState } from './store.types';

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createUISlice(set, get,),
        ...createProcessSlice(set, get,),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          currentStepId: state.currentStepId,
          stepState: state.stepState,
        }),
      }
    )
  )
);
