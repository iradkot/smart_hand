import React, {createContext, ReactNode, useContext, useState} from 'react';

export interface HistoryItem {
  timestamp: number;
  path: string;
  content: string;
  type: 'copy' | 'gpt-chat';
  discussion?: ChatEntry[];
}

type ChatEntry = {
  user: string;
  text: string;
}

interface HistoryContextProps {
  history: HistoryItem[];
  addToHistory: (path: string, content: string, type: 'copy' | 'gpt-chat') => void;
}

interface HistoryProviderProps {
  children: ReactNode;  // Specify that children is expected
}

const HistoryContext = createContext<HistoryContextProps | undefined>(undefined);

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (path: string, content: string, type: 'copy' | 'gpt-chat') => {
    const newItem: HistoryItem = {
      timestamp: Date.now(),
      path,
      content,
      type
    };
    setHistory((prevHistory) => [...prevHistory, newItem]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
