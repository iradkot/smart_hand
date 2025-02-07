// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/executingTest.ts
import { assign } from 'xstate';
import { Services, States } from '../constants';

export const executingTest = {
  invoke: {
    src: Services.executeTest,
    input: ({ context }) => ({
      packageManager: context.packageManager,
      directoryPath: context.directoryPath,
      testFileName: context.testGeneration!.testFileName,
    }),
    onDone: {
      target: States.checkingIfFailed,
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
