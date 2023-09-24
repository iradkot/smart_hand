import {useState} from 'react'

type Role = 'user' | 'gpt'

interface Message {
  role: Role
  content: string
}

export const useChatHistory = (): {
  chatHistory: Message[]
  addMessage: (role: Role, content: string) => void
} => {
  const [chatHistory, setChatHistory] = useState<Message[]>([])

  const addMessage = (role: Role, content: string): void => {
    const newMessage = { role, content }
    setChatHistory((prevHistory) => [...prevHistory, newMessage])
  }

  return { chatHistory, addMessage }
}
