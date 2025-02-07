// analyzingFile.ts
import { assign } from 'xstate';
import { Services, States } from '../constants';
import type { TestMakerContext } from '../../types';
import type { DoneAnalyzeFile, ErrorAnalyzeFile } from '../../types/machineEvents';

export const analyzingFile = {
  invoke: {
    src: Services.analyzeFile,
    input: ({ context }: { context: TestMakerContext }) => ({
      directoryPath: context.directoryPath,
      fileName: context.fileName,
    }),
    onDone: {
      target: States.classifyingFile,
      actions: assign({
        analysis: ({ event }: { event: DoneAnalyzeFile }) => event.output
      }) as any, // Temporary cast until we create proper action types
    },
    onError: {
      target: States.failure,
      actions: assign({
        error: ({ event }: { event: ErrorAnalyzeFile }) => event.error
      }) as any,
    },
  },
};
