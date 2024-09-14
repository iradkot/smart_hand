import { StateCreator } from 'zustand';
import { RehydrationSlice, StoreState } from '../store.types';

export const createRehydrationSlice: StateCreator<
  StoreState,
  [],
  [],
  RehydrationSlice
> = (set) => ({
  rehydrated: false,
  setRehydrated: (rehydrated: boolean) => set({ rehydrated }),
});
