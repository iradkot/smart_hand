import { TextField, Button } from '@material-ui/core';
import React, { FC } from 'react';

// Define an interface for props
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ value, onChange, onSend }) => {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <TextField
        id="chatInput"
        label="Enter message"
        variant="outlined"
        value={value}
        onChange={handleInputChange}
        multiline
        minRows={1} // Set minimum rows
        maxRows={undefined} // Ensure there is no limit on maxRows
        fullWidth
        inputProps={{ style: { overflowY: 'auto' } }} // Allow overflow for better UX
        style={{ marginBottom: 8 }} // Keep margin for button spacing
      />
      <Button variant="contained" color="primary" onClick={onSend} style={{ marginTop: 8 }}>
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
