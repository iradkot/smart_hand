import {useState} from 'react'

const generateUniqueSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

type Role = 'user' | 'gpt'

interface Message {
  role: Role
  content: string
}

export const useChatHistory = (): {
  sessionId: string
  chatHistory: Message[]
  addMessage: (role: Role, content: string) => void
} => {
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [sessionId] = useState(generateUniqueSessionId())

  const addMessage = (role: Role, content: string): void => {
    const newMessage = { role, content }
    setChatHistory((prevHistory) => [...prevHistory, newMessage])
  }

  return { chatHistory, addMessage, sessionId}
}
