import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { askGPTPost } from '../../../api/requests';
import { useChatHistory } from './hooks/useChatHistory';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import Loader from '../Loader';

function GPTChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const { chatHistory, addMessage, sessionId } = useChatHistory();

  const fetchGPTResponse = async (input) => {
    try {
      const response = await askGPTPost(sessionId, input);
      return response.content; // Assuming the response is structured as { content: ... }
    } catch (error) {
      console.error('Failed to fetch GPT response:', error.message);
      throw error;
    }
  };

  const handleSend = async () => {
    addMessage('user', userInput);
    setIsLoading(true);

    try {
      const gptResponse = await fetchGPTResponse(userInput);
      addMessage('gpt', gptResponse);
    } catch (error) {
      addMessage('gpt', 'An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [chatHistory]);

  return (
    <div>
      <h2>GPT Chat</h2>
      <ChatHistory chatHistory={chatHistory} />
      {isLoading ? (
        <Loader size={50} color="#000000" />
      ) : (
        <ChatInput value={userInput} onChange={setUserInput} onSend={handleSend} />
      )}
    </div>
  );
}

export default GPTChat;
