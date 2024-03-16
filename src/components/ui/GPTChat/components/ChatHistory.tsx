import { FC } from 'react'
import { renderGPTResponse } from '../formatGptResponse'
import { ChatEntry } from '../../../../renderer/src/types' // Import or define your type

interface Props {
  chatHistory: ChatEntry[]
}

const ChatHistory: FC<Props> = ({ chatHistory }) => (
  <div>
    {chatHistory.map((entry, index) => (
      <article key={`${entry.role}-${index}`}>
        <strong>{entry.role === 'user' ? 'You: ' : 'GPT: '}</strong>
        {entry.role === 'gpt' ? renderGPTResponse(entry.content) : entry.content}
      </article>
    ))}
  </div>
)

export default ChatHistory
