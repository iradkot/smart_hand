import { TextField, Button } from '@material-ui/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC } from 'react'

// Define an interface for props
interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

const ChatInput: FC<ChatInputProps> = ({ value, onChange, onSend }) => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <TextField
      id="chatInput"
      label="Enter message"
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      rows={3}
      // rowsMax={10}
      fullWidth
      style={{ maxHeight: '100%', marginBottom: 8 }}
    />
    <Button variant="contained" color="primary" onClick={onSend} style={{ marginTop: 8 }}>
      Send
    </Button>
  </div>
)

export default ChatInput
