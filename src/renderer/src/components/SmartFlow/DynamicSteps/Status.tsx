import React, { useState } from 'react'
import { Button, Label } from '../../../style/styledComponents'

import CopySections from '../CopySections'
import { useCopyToClipboard } from '../../../contexts/CopyToClipboardContext'

function Status({ stepState, setStepState }) {
  const { option, chatWithGPT, isLoading, error, copiedContent } = useCopyToClipboard()
  console.log({ copiedContent })

  // Add new state variables
  const [gptSuccess, setGptSuccess] = useState(null)
  const [gptError, setGptError] = useState(null)

  return (
    <>
      <Label>Step 3: Status</Label>
      {/*<div>{message}</div>*/}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {gptError && <p>GPT Error: {gptError}</p>}
      {option === '3' && stepState.gptAnswer && !isLoading && !error && (
        <div>
          <h2>GPT Answer</h2>
          <p>{stepState.gptAnswer}</p>
        </div>
      )}
      <CopySections content={copiedContent} />
    </>
  )
}

export default Status
