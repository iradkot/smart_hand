import { useState } from 'react';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const addMessage = (role, content) => {
    const newMessage = { role, content };
    setChatHistory(prevHistory => [...prevHistory, newMessage]);
  };

  return { chatHistory, addMessage };
};
