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
      mockPaths: context.testGeneration?.generatedMocks?.map(mock => mock.mockPath) || [],
      sessionId: context.sessionId // Add sessionId for integrated AI assistance
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
