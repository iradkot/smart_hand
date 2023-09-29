import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { askGPTPost, createUser } from '../../../../api/requests'
import { useChatHistory } from './hooks/useChatHistory'
import ChatInput from './components/ChatInput'
import ChatHistory from './components/ChatHistory'
import Loader from '../Loader' // Separate component for displaying chat history

function GPTChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [userInput, setUserInput] = useState(
    'Give 2 tables side by side, one of top earned women in basketball and one of top earned women in soccer, with how much money they earned\n',
  )
  const { chatHistory, addMessage } = useChatHistory()

  const registerNewUser = async () => {
    const newUserDetails = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'securePassword123',
      // ... add other user fields as needed
    }

    try {
      const newUser = await createUser(newUserDetails)
      console.log('User created:', newUser)
    } catch (error) {
      console.error('Failed to register user:', error.message)
    }
  }

  const fetchGPTResponse = async (input): Promise<string> => {
    try {
      const response = await askGPTPost(input)
      return response
    } catch (error) {
      console.error('Failed to fetch GPT response:', error.message)
      throw error
    }
  }

  const handleSend = async (): Promise<void> => {
    addMessage('user', userInput)
    setIsLoading(true)

    try {
      const gptResponse = await fetchGPTResponse(userInput)
      await registerNewUser()
      addMessage('gpt', gptResponse)
    } catch (error) {
      addMessage('gpt', 'An error occurred while fetching the response.')
      // Handle the error gracefully; Maybe show an error toast/message.
    } finally {
      setIsLoading(false)
      setUserInput('')
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
