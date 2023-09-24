import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { askGPTPost } from '../../../../../../api/requests'
import { useChatHistory } from './hooks/useChatHistory'
import ChatInput from './components/ChatInput'
import ChatHistory from './components/ChatHistory'
import Loader from "../../../Loader"; // Separate component for displaying chat history

function GPTChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [userInput, setUserInput] = useState(
    'Give 2 tables side by side, one of top earned women in basketball and one of top earned women in soccer, with how much money they earned\n',
  )
  const { chatHistory, addMessage } = useChatHistory()
  const fetchGPTResponse = async (input): Promise<string> => {
    try {
      const response = await askGPTPost(input)
      return response
    } catch (error) {
      console.log('Error fetching GPT response:', error)
      return 'An error occurred'
    }
  }

  const handleSend = async (): Promise<void> => {
    addMessage('user', userInput)
    setIsLoading(true)

    try {
      const gptResponse = await fetchGPTResponse(userInput)
      addMessage('gpt', gptResponse)
      setUserInput('')
    } catch (error) {
      // Handle the error gracefully; Maybe show an error toast/message.
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const highlightCode = (): void => Prism.highlightAll()
    highlightCode()
  }, [chatHistory])

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
  )
}

export default GPTChat
