import React, { createContext, useContext, useState } from 'react';

interface CopyItem {
  timestamp: number;
  path: string;
  content: string;
}

interface CopyHistoryContextProps {
  history: CopyItem[];
  addToHistory: (path: string, content: string) => void;
}

const CopyHistoryContext = createContext<CopyHistoryContextProps | undefined>(undefined);

export const CopyHistoryProvider: React.FC = ({ children }) => {
  const [history, setHistory] = useState<CopyItem[]>([]);

  const addToHistory = (path: string, content: string) => {
    const newItem: CopyItem = {
      timestamp: Date.now(),
      path,
      content,
    };
    setHistory((prevHistory) => [...prevHistory, newItem]);
  };

  return (
    <CopyHistoryContext.Provider value={{ history, addToHistory }}>
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
