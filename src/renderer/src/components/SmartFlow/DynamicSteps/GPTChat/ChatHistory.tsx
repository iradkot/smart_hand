import React from 'react';
import {renderGPTResponse} from "./formatGptResponse";

const ChatHistory = ({ chatHistory }) => (
  <div>
    {chatHistory.map((entry, index) => (
      <div key={`${entry.role}-${index}`}>
        <strong>{entry.role === 'user' ? 'You: ' : 'GPT: '}</strong>
        {entry.role === 'gpt' ? renderGPTResponse(entry.content) : entry.content}
      </div>
    ))}
  </div>
);

export default ChatHistory;
