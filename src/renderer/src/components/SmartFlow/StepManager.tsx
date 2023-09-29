import React, { FC } from 'react'
import * as Steps from './DynamicSteps'
import { StepState } from './types'
import { useCopyToClipboard } from '../../contexts/CopyToClipboardContext'
import { ChooseOptionsStep, DirectoryPathInput, GPTChatStep, StatusStep } from './constants'
import styled from "styled-components";

const stepsConfig = [
  {
    id: ChooseOptionsStep,
    component: Steps.ChooseOptions,
    getNextStepId: (state: StepState) => {
      if (state.option === '1' || state.option === '2') {
        return DirectoryPathInput
      } else if (state.option === '3') {
        return GPTChatStep
      }
      return null
    },
  },
  {
    id: DirectoryPathInput,
    component: Steps.DirectoryPathInput,
    getNextStepId: (_: StepState) => StatusStep,
  },
  {
    id: GPTChatStep,
    component: Steps.GPTChat,
    getNextStepId: (_state: StepState) => StatusStep, // Navigate to Status after chat
  },
  {
    id: StatusStep,
    component: Steps.Status,
    getNextStepId: (_state: StepState) => null, // End of the flow
  },
]

const StepManager: FC = () => {
  const { stepState, setStepState, currentStepId, setCurrentStepId } = useCopyToClipboard()

  const currentStep = stepsConfig.find((step) => step.id === currentStepId)

  const proceedToNextStep = (): void => {
    console.log('Current Step ID:', currentStepId) // Debug line

    if (currentStep) {
      const nextStepId = currentStep.getNextStepId(stepState)
      console.log('Next Step ID:', nextStepId) // Debug line

      if (nextStepId) {
        setCurrentStepId(nextStepId)
      }
    }
  }

  const CurrentStepComponent = currentStep?.component

  return (
    <StepContainer>
      {CurrentStepComponent ? (
        <StepContainer>
          <CurrentStepComponent state={stepState} setState={setStepState} />
          <button onClick={proceedToNextStep}>Next</button>
        </StepContainer>
      ) : (
        <p>Step not found</p>
      )}
    </StepContainer>
  )
}

export default StepManager

const StepContainer = styled.div`
  max-width: 100%;
`;
