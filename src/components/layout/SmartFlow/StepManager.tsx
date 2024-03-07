import React, { FC } from 'react';
import * as Steps from './DynamicSteps';
import { StepState } from './types';
import { useCopyToClipboard } from '../../../renderer/src/contexts/CopyToClipboardContext';
import { ChooseOptionsStep, DirectoryPathInput, GPTChatStep, StatusStep } from './constants';
import styled from "styled-components";
import { useStepManager } from "../../../renderer/src/contexts/StepManagerContext";
import { StyledButton } from "../../ui/styledComponents";
import useKeyboardNavigation from "../../../renderer/src/hooks/useKeyboardNavigation";

// Define stepsConfig with streamlined getNextStepId logic
const stepsConfig = [
  {
    id: ChooseOptionsStep,
    component: Steps.ChooseOptions,
    getNextStepId: (stepState) => stepState.option === '3' ? GPTChatStep : DirectoryPathInput,
  },
  {
    id: DirectoryPathInput,
    component: Steps.DirectoryPathInput,
    getNextStepId: () => StatusStep, // Always navigate to StatusStep
  },
  {
    id: GPTChatStep,
    component: Steps.GPTChat,
    getNextStepId: () => StatusStep,
  },
  {
    id: StatusStep,
    component: Steps.Status,
    getNextStepId: null, // End of the flow
  },
];

const StepManager: FC = () => {
  const { stepState, setStepState, currentStepId, setCurrentStepId } = useStepManager();
  const currentStep = stepsConfig.find((step) => step.id === currentStepId);

  const proceedToNextStep = () => {
    const nextStepId = currentStep?.getNextStepId(stepState) ?? null; // Handle potential null
    if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  const CurrentStepComponent = currentStep?.component;
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
  );
};

export default StepManager

const StepContainer = styled.div`
  max-width: 100%;
`;
