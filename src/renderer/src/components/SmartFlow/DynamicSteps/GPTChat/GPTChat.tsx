import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { askGPTPost } from '../../../../../../api/requests'
import { renderGPTResponse } from './formatGptResponse'
import { useChatHistory } from './useChatHistory'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory' // Separate component for displaying chat history

function GPTChat({ state, setState }) {
  const [userInput, setUserInput] = useState('')
  const { chatHistory, addMessage } = useChatHistory()
  const handleInputChange = (e) => setUserInput(e.target.value)

  const fetchGPTResponse = async (input) => {
    try {
      const response = await askGPTPost(input)
      return response
    } catch (error) {
      console.log('Error fetching GPT response:', error)
      return 'An error occurred'
    }
  }

  const handleSend = async () => {
    // Add user message to chat history
    addMessage('user', userInput)

    // Fetch GPT response
    const gptResponse = await fetchGPTResponse(userInput)

    // Add GPT message to chat history
    const gptMessage = { role: 'gpt', content: gptResponse }
    console.log({ gptMessage, gptResponse })
    addMessage('gpt', gptResponse)
    // Clear user input
    setUserInput('')
  }

  useEffect(() => {
    Prism.highlightAll()
  }, [chatHistory])

  return (
    <div>
      <h2>GPT Chat</h2>
      <ChatHistory chatHistory={chatHistory} />
      <ChatInput value={userInput} onChange={setUserInput} onSend={handleSend} />
    </div>
  )
}

export default GPTChat
