// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/checkingIfFailed.ts
import { States } from '../constants';

export const checkingIfFailed = {
  always: [
    {
      target: States.success,
      guard: ({ context }) => context.testResult?.success === true,
    },
    { target: States.handlingFailure },
  ],
};
