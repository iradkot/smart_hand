import { FC } from 'react';
import { renderGPTResponse } from '../formatGptResponse';
import { ChatEntry } from '../../../types/types'; // Import or define your type
import styled from 'styled-components';
import { Person as UserIcon, Router as GptIcon } from '@material-ui/icons'; // Import Material-UI icons

// Styled components
const ChatContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
`;

const ChatEntryStyled = styled.article<{ role: 'user' | 'gpt' }>`
  padding: 10px;
  margin: 5px 0;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadow.small};
  background-color: ${({ role, theme }) => (role === 'user' ? theme.inRangeColor : theme.accentColor)};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;

  strong {
    margin-right: 10px; // Add spacing between the icon and text
  }
`;

const IconWrapper = styled.span`
  margin-right: 5px;
`;

interface Props {
  chatHistory: ChatEntry[];
}

const ChatHistory: FC<Props> = ({ chatHistory }) => {

  return (
    <ChatContainer>
      {chatHistory.map((entry, index) => (
        <ChatEntryStyled key={`${entry.role}-${index}`} role={entry.role}>
          <IconWrapper>
            {entry.role === 'user' ? <UserIcon /> : <GptIcon />} {/* Use Material-UI icons */}
          </IconWrapper>
          <strong>{entry.role === 'user' ? 'You: ' : 'GPT: '}</strong>
          {entry.role === 'gpt' ? renderGPTResponse(entry.content) : entry.content}
        </ChatEntryStyled>
      ))}
    </ChatContainer>
  );
};

export default ChatHistory;
