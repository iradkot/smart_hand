// useKeyboardNavigation.ts
import { useEffect } from 'react';

type Callback = () => void;

const useKeyboardNavigation = (callback: Callback, triggerKey: string = 'Enter') => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === triggerKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, triggerKey]);
};

export default useKeyboardNavigation;
