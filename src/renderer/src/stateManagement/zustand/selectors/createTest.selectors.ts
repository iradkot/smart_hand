// hooks/useStepState.ts
import { StepState } from '../../../types';
import {useStore} from "../useStore";

export const useStepState = (): StepState =>
  useStore((state) => state.stepState);

export const useIsLoading = (): boolean =>
  useStore((state) => state.isLoading);

export const useError = (): string | null =>
  useStore((state) => state.error);
