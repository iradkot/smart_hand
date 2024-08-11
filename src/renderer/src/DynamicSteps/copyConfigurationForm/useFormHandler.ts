import { useState, useCallback } from 'react';
import { OptionValue } from '../../types';
import { useStepManager } from '../../contexts';

export const useFormHandler = (
  initialDirectoryPath: string,
  initialOption: OptionValue
) => {
  const { stepState, setStepState } = useStepManager();
  const [directoryPath, setDirectoryPath] = useState(initialDirectoryPath);
  const [option, setOption] = useState<OptionValue>(initialOption);

  // State management phase
  const updateState = useCallback(() => {
    return new Promise<void>((resolve) => {
      setStepState((prevState) => ({
        ...prevState,
        directoryPath,
        option,
      }));
      resolve(); // Resolves the promise once state update is complete
    });
  }, [directoryPath, option, setStepState]);

  return {
    directoryPath,
    option,
    setDirectoryPath,
    setOption,
    updateState,
  };
};
