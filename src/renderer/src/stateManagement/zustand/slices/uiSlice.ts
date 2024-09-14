import { StateCreator } from 'zustand';
import { UISlice, StoreState } from '../store.types';

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (
  set,
  // @ts-ignore // This is for later use
  get
) => ({
  isLoading: false,
  error: null,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
});
