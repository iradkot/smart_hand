import React from 'react'
import { Label, Input, Button } from '../../../style/styledComponents'
import { StepState } from '../types'

function DirectoryPathInput({
  state,
  setState,
}: {
  state: StepState
  setState: React.Dispatch<React.SetStateAction<StepState>>
}) {
  const directoryPath = state.directoryPath || ''
  return (
    <>
      <Label>Step 1: Enter Directory Path</Label>
      <Input
        type="text"
        value={directoryPath}
        onChange={(e) => setState({ ...state, directoryPath: e.target.value })}
      />
    </>
  )
}

export default DirectoryPathInput
