// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/classifyingFile.ts
import { assign } from 'xstate';
import { Services, States } from '../constants';
import type {
  DoneClassifyFile,
  ErrorClassifyFile,
  TestMakerContext,
} from 'src/main/smartTasks/smartUnitTestMaker/types'

export const classifyingFile = {
  invoke: {
    src: Services.classifyFile,
    input: ({ context }: { context: TestMakerContext }) => ({
      sessionId: context.sessionId,
      fileContent: context.fileContent,
      analysis: context.analysis!,
    }),
    onDone: {
      target: States.generatingTest,
      actions: assign({
        classification: ({ event }: {event: DoneClassifyFile}) => event.output,
      }) as any,
    },
    onError: {
      target: States.failure,
      actions: assign({
        error: ({ event }: {event: ErrorClassifyFile}) => event.error,
      }) as any,
    },
  },
};
