import React, { FC } from 'react'
import * as Steps from './DynamicSteps'
import { StepState } from './types'
import { useCopyToClipboard } from '../../contexts/CopyToClipboardContext'
import { ChooseOptionsStep, DirectoryPathInput, GPTChatStep, StatusStep } from './constants'
import styled from "styled-components";
import {useStepManager} from "../../contexts/StepManagerContext";
import { StyledButton } from "../../style/styledComponents";
import useKeyboardNavigation from "../../hooks/useKeyboardNavigation";

const stepsConfig = [
  {
    id: ChooseOptionsStep,
    component: Steps.ChooseOptions,
    getNextStepId: (stepState: StepState) => {
      if (stepState.option === '1' || stepState.option === '2') {
        return DirectoryPathInput
      } else if (stepState.option === '3') {
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
  const { stepState, setStepState, currentStepId, setCurrentStepId } = useStepManager()

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

  useKeyboardNavigation(proceedToNextStep);


  return (
    <StepContainer>
      {CurrentStepComponent ? (
        <StepContainer>
          <CurrentStepComponent stepState={stepState} setStepState={setStepState} />
          <StyledButton onClick={proceedToNextStep}>Next</StyledButton>
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
