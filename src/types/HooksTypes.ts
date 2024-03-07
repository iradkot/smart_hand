import { StepState } from './StepTypes';

// If we have contexts that these hooks utilize, we might define their expected values here.
export interface UseStepsHook {
  stepState: StepState;
  setStepState: React.Dispatch<React.SetStateAction<StepState>>;
  currentStepId: string;
  proceedToNextStep: (stepsConfig: StepConfig[], currentStepId: string) => void;
}

export interface StepConfig {
  id: string;
  component: React.ComponentType<{ stepState: StepState; setStepState: (state: StepState) => void }>;
  getNextStepId: (stepState: StepState) => string | null;
}
