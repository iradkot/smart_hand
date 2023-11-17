import React from 'react'
import { Label, Input, Button } from '../../../style/styledComponents'
import { StepState } from '../types'

function DirectoryPathInput({
  stepState,
  setStepState,
}: {
  stepState: StepState
  setStepState: React.Dispatch<React.setStepStateAction<StepState>>
}) {
  const directoryPath = stepState.directoryPath || ''
  return (
    <>
      <Label>Step 1: Enter Directory Path</Label>
      <Input
        type="text"
        value={directoryPath}
        onChange={(e) => setStepState({ ...stepState, directoryPath: e.target.value })}
      />
    </>
  )
}

export default DirectoryPathInput
