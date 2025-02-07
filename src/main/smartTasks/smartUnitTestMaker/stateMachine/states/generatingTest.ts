// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/generatingTest.ts
import { assign } from 'xstate';
import { Services, States } from '../constants';

export const generatingTest = {
  invoke: {
    src: Services.generateTest,
    input: ({ context }) => ({
      sessionId: context.sessionId,
      directoryPath: context.directoryPath,
      fileName: context.fileName,
      fileContent: context.fileContent,
      classification: context.classification!,
    }),
    onDone: {
      target: States.executingTest,
      actions: assign({
        testGeneration: ({ event }) => event.output,
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
