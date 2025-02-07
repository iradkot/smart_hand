// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/fixingTest.ts
import { assign } from 'xstate';
import { Services, States } from '../constants';

export const fixingTest = {
  invoke: {
    src: Services.fixTestFailure,
    input: ({ context }) => ({
      sessionId: context.sessionId,
      directoryPath: context.directoryPath,
      testFileName: context.testGeneration!.testFileName,
      lastError: context.testResult?.errorMessage || '',
      packageManager: context.packageManager,
    }),
    onDone: {
      target: States.executingTest,
      actions: assign({
        testResult: ({ event }) => event.output,
      }) as any,
    },
    onError: {
      target: States.failure,
      actions: assign({
        error: ({ event }) => event.error,
      }) as any,
    },
  },
};
