import { createContext, useContext, useState, ReactNode, FC } from 'react';
import { toast } from 'react-toastify';

interface CopyItem {
  timestamp: number;
  path: string;
  content: string;
}

interface CopyHistoryProviderProps {
  children: ReactNode;
}

interface CopyHistoryContextProps {
  history: CopyItem[];
  addToHistory: (path: string, content: string) => void;
  copyToClipboardWithToast: (content: string, sectionIndex: number) => void;
}

const CopyHistoryContext = createContext<CopyHistoryContextProps | undefined>(undefined);

export const CopyHistoryProvider: FC<CopyHistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<CopyItem[]>([]);

  const addToHistory = (path: string, content: string) => {
    const newItem: CopyItem = {
      timestamp: Date.now(),
      path,
      content,
    };
    setHistory((prevHistory) => [...prevHistory, newItem]);
  };

  const copyToClipboardWithToast = (content: string, sectionIndex: number) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success(`Section ${sectionIndex + 1} copied!`);
      addToHistory(`Section ${sectionIndex + 1}`, content);
    }).catch((err) => {
      toast.error(`Failed to copy Section ${sectionIndex + 1}`);
      console.log('Failed to copy content to clipboard:', err);
    });
  };

  return (
    <CopyHistoryContext.Provider value={{ history, addToHistory, copyToClipboardWithToast }}>
      {children}
    </CopyHistoryContext.Provider>
  );
};

export const useCopyHistory = () => {
  const context = useContext(CopyHistoryContext);
  if (!context) {
    throw new Error('useCopyHistory must be used within a CopyHistoryProvider');
  }
  return context;
};
