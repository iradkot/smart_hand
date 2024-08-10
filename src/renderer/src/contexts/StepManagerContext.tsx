import React, { createContext, useContext, useState, useCallback } from 'react';
import { StepState } from '../types';

export interface StepManagerContextProps {
  currentStepId: string;
  setCurrentStepId: React.Dispatch<React.SetStateAction<string>>;
  stepState: StepState;
  setStepState: (stateAction: React.SetStateAction<StepState>, callback?: () => void) => void;
}

const StepManagerContext = createContext<StepManagerContextProps | undefined>(undefined);

export const StepManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStepId, setCurrentStepId] = useState<string>('ChooseOptions');
  const initialStepState: StepState = {
    // directoryPath: '/Users/iradkotton/projects/smart_hand', // for mac
    directoryPath: 'C:\\Users\\irad1\\projects\\smart_hand', // for windows
    option: '',
    message: '',
    copiedContent: '',
  };
  const [stepState, setStepStateInternal] = useState<StepState>(initialStepState);

  // Enhanced setStepState function that supports an optional callback to be executed after the state is set.
  const setStepState = useCallback((stateAction: React.SetStateAction<StepState>, callback?: () => void) => {
    setStepStateInternal((prev) => {
      const newState = typeof stateAction === 'function' ? stateAction(prev) : stateAction;
      // Execute the callback if provided
      if (callback) {
        // This ensures the callback runs after the state has been updated
        // However, keep in mind this is still not "awaitable" in the traditional async/await sense
        setTimeout(callback, 0);
      }
      return newState;
    });
  }, []);

  return (
    <StepManagerContext.Provider value={{ currentStepId, setCurrentStepId, stepState, setStepState }}>
      {children}
    </StepManagerContext.Provider>
  );
};

export const useStepManager = () => {
  const context = useContext(StepManagerContext);
  if (!context) {
    throw new Error('useStepManager must be used within a StepManagerProvider');
  }
  return context;
};
