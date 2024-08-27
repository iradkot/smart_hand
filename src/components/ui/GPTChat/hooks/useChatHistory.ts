import {useState} from 'react'
import {generateUniqueSessionId} from "../../../../utils/generateUniqueSessionId";

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
