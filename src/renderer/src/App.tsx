import React from 'react'
import CopyHistory from "./components/CopyHistory";
import CopyToClipboardSteps from "./components/SmartFlow/CopyToClipboardSteps"; // Make sure to adjust the path!

function App() {
  return (
    <div>
      <h1>Your App Title</h1>
      <CopyToClipboardSteps />
      <CopyHistory />
      {/* Other components or elements */}
    </div>
  )
}

export default App
