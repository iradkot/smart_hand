import React from 'react';

const ChatInput = ({value, onChange, onSend}) => (
  <div>
    <label htmlFor="chatInput">Enter message:</label>
    <input id="chatInput" type="text" value={value} onChange={e => onChange(e.target.value)}/>
    <button onClick={onSend}>Send</button>
  </div>
);


export default ChatInput;
