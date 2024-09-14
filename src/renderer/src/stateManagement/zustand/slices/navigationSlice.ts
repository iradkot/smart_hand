import {StateCreator} from 'zustand';
import {NavigationSlice, StoreState} from '../store.types';

export const createNavigationSlice: StateCreator<StoreState, [], [], NavigationSlice> =
  (set, get) => ({
    currentRoute: get()?.currentRoute || '/copy-configuration-form',  // Use rehydrated value if available
  setCurrentRoute: (route: string) => {
    set({currentRoute: route});
  },
});

