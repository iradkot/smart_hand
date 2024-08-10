import React, {createContext, useContext, useState, ReactNode} from 'react';
import {useStepManager} from './StepManagerContext';
import {COPYING_PROCESS_INVOKE} from "../../../constants";
import {useNavigate} from "react-router-dom";

interface ContextProps {
  directoryPath: string;
  option: string;
  setOption: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  copiedContent: string;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  resetProcess: () => void;
  copyToClipboard: (content: string) => Promise<{ message: string; content: string }>;
}

const CopyToClipboardContext = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode; // Correctly type children prop
}

export const CopyToClipboardProvider: React.FC<ProviderProps> = ({children}) => {
  const navigate = useNavigate(); // Correct use of useNavigate
  const { stepState, setStepState } = useStepManager();
  const [step, setStep] = useState<number>(1);
  const [option, setOption] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [copiedContent, setCopiedContent] = useState<string>('');
  const resetProcess = () => {
    setStepState((prev) => ({
      ...prev,
      directoryPath: '',
      option: '',
      message: '',
      copiedContent: '',
    }));
  };


  const copyToClipboard = (content: string): Promise<{ message: string; content: string }> => {
    return new Promise((resolve, reject) => {
      setCopiedContent(content);
      window.electron.ipcRenderer
        .invoke(COPYING_PROCESS_INVOKE, stepState.directoryPath, stepState.option)
        .then((response: { message: string; content: string; }) => {
          const { message, content } = response as { message: string; content: string };
          setMessage(message);
          setCopiedContent(content);
          navigate('/status');
          resolve({ message, content });
        })
        .catch((err: { message: any; }) => {
          setMessage(`Error: ${err.message}`);
          reject(err);
        });
    });
  };
  return (
    <CopyToClipboardContext.Provider
      value={{
        directoryPath: stepState.directoryPath, // Correctly reference directoryPath from stepState
        option,
        setOption,
        message,
        copiedContent,
        step,
        setStep,
        resetProcess,
        copyToClipboard,
      }}
    >
      {children}
    </CopyToClipboardContext.Provider>
  );
};

export const useCopyToClipboard = () => {
  const context = useContext(CopyToClipboardContext);
  if (!context) {
    throw new Error('useCopyToClipboard must be used within a CopyToClipboardProvider');
  }
  return context;
};
