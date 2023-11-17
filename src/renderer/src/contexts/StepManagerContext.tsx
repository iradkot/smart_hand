// contexts/StepManagerContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react'
import { StepState } from '../components/SmartFlow/types'

export interface StepManagerContextProps {
  currentStepId: string
  setCurrentStepId: React.Dispatch<React.SetStateAction<string>>
  stepState: StepState
  setStepState: React.Dispatch<React.SetStateAction<StepState>>
}

const StepManagerContext = createContext<StepManagerContextProps | undefined>(undefined)

export const StepManagerProvider: React.FC = ({ children }) => {
  const [currentStepId, setCurrentStepId] = useState<string>('ChooseOptions')
  const initialStepState: StepState = {
    directoryPath: '/Users/irad.kotton/projects/side-projcts/smart-hand/src/renderer/src',
    option: '',
    message: '',
    copiedContent: '',
  }
  const [stepState, setStepState] = useState<StepState>(initialStepState)

  useEffect(() => {
    console.log('StepManagerContext: currentStepId:', currentStepId)
  }, [currentStepId])

  useEffect(() => {
    console.log('StepManagerContext: stepState:', stepState)
  }, [stepState])

  return (
    <StepManagerContext.Provider
      value={{
        currentStepId,
        setCurrentStepId,
        stepState,
        setStepState,
      }}
    >
      {children}
    </StepManagerContext.Provider>
  )
}

export const useStepManager = () => {
  const context = useContext(StepManagerContext)
  if (!context) {
    throw new Error('useStepManager must be used within a StepManagerProvider')
  }
  return context
}
