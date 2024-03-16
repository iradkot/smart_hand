// ApplicationRouteManager.tsx
import React, { FC } from 'react';
import * as Steps from './DynamicSteps';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { useStepManager } from "./contexts/StepManagerContext";
import { StyledButton } from "../../components/ui/styledComponents";
import useKeyboardNavigation from "./hooks/useKeyboardNavigation";

// Import constants for step IDs
import { ChooseOptionsStep, DirectoryPathInput, GPTChatStep, StatusStep } from './constants';

const ApplicationRouteManager: FC = () => {
  const { stepState, setStepState, currentStepId, setCurrentStepId } = useStepManager();
  const navigate = useNavigate();

  // Define stepsConfig to map step IDs to their respective components
  const routesConfig = [
    {
      id: ChooseOptionsStep,
      component: Steps.ChooseOptions,
    },
    {
      id: DirectoryPathInput,
      component: Steps.DirectoryPathInput,
    },
    {
      id: GPTChatStep,
      component: Steps.GPTChat,
    },
    {
      id: StatusStep,
      component: Steps.Status,
    },
  ];

  const currentStep = routesConfig.find((step) => step.id === currentStepId);

  const handleNavigation = () => {
    let nextStepId;
    // Logic to determine the next step based on the current step and state
    switch (currentStepId) {
      case ChooseOptionsStep:
        nextStepId = stepState.option === '3' ? GPTChatStep : DirectoryPathInput;
        break;
      case DirectoryPathInput:
      case GPTChatStep:
        nextStepId = StatusStep;
        break;
      default:
        nextStepId = null; // End of the flow
    }

    if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  const handleBackNavigation = () => {
    navigate(-1); // Use React Router's navigate function for back navigation
  };

  const CurrentStepComponent = currentStep?.component;
  useKeyboardNavigation(handleNavigation); // Ensure keyboard navigation is set up

  return (
    <StepContainer>
      {CurrentStepComponent ? (
        <>
          <CurrentStepComponent stepState={stepState} setStepState={setStepState} />
          <StyledButton onClick={handleNavigation}>Next</StyledButton>
          <StyledButton onClick={handleBackNavigation}>Back</StyledButton>
        </>
      ) : (
        <p>Step not found</p>
      )}
    </StepContainer>
  );
};

export default ApplicationRouteManager; // old code, stayed until finishing refactoring

const StepContainer = styled.div`
  max-width: 100%;
`;
