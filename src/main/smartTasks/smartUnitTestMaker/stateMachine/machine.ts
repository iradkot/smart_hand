// src/main/smartTasks/smartUnitTestMaker/stateMachine/machine.ts

import { setup } from 'xstate';
import { testMakerStates } from './states';
import { testMakerActors } from './actors';
import { detectPackageManager } from '../../../utils/packageUtils';
import { testMakerGuards } from './guards';
import { validateMocks } from './states/validateMocks';
import {
  TestMakerContext,
  TestMakerInput,
  TestMakerEvent,
} from '../types';

type MachineInput = TestMakerInput & { maxRetries?: number };

export const testMakerMachine = setup({
  types: {
    context: {} as TestMakerContext,
    events: {} as TestMakerEvent,
    input: {} as MachineInput,
  },
  guards: testMakerGuards,
  actors: testMakerActors,
}).createMachine({
  id: 'testMakerMachine',
  initial: 'analyzingFile',
  context: ({ input }) => ({
    sessionId: input.sessionId,
    directoryPath: input.directoryPath,
    fileName: input.fileName,
    fileContent: input.fileContent,
    packageManager: detectPackageManager(input.directoryPath),
    retries: 0,
    maxRetries: input.maxRetries ?? 2,
    analysis: null,
    classification: null,
    testGeneration: null,
    testResult: null,
    error: null,
    mocks: [], // Initialize empty mocks array
  }),
  states: {
    ...testMakerStates,
    testGeneration: {
      ...testMakerStates.testGeneration,
      on: {
        NEXT: 'validateMocks'
      }
    },
    validateMocks: {
      invoke: {
        id: 'validateMocks',
        src: validateMocks,
        onDone: {
          target: 'executeTests'
        },
        onError: {
          target: 'failure',
          // ...existing error handling...
        }
      }
    },
    executeTests: {
      ...testMakerStates.executeTests,
      on: {
        SUCCESS: 'success',
        FAILURE: 'failure'
      }
    },
    success: {
      ...testMakerStates.success
    },
    failure: {
      ...testMakerStates.failure
    }
  }
});
