// src/main/smartTasks/smartUnitTestMaker/stateMachine/testMakerMachine.ts

import { assign, fromPromise, setup } from 'xstate'
import { TestMakerContext, TestMakerInput } from '../types'
import { analyzeProjectFlow } from '../flows/analyzeProjectFlow'
import { prepareTestContextFlow } from '../flows/prepareTestContextFlow'
import { createInitialTestFlow } from '../flows/createInitialTestFlow'
import { handleTestFailureFlow } from '../flows/handleTestFailureFlow'
import { cannotRetry, canRetry, testPassed } from './guards'

export const testMakerMachine = setup({
  types: {
    context: {} as TestMakerContext,
    input: {} as TestMakerInput,
    events: {} as { type: 'START' | 'RETRY' },
  },
  guards: { testPassed, canRetry, cannotRetry },
}).createMachine({
    id: 'testMaker',
    initial: 'idle',
    context: ({ input }) => ({
      ...input,
      retries: 0,
      maxRetries: 3,
      testResult: null,
      analyzedPackageJson: null,
      testExamples: '',
      packageManager: '',
      projectPath: input.packageJsonPath
    }),
    states: {
      idle: {
        on: {
          START: 'analyzingProject',
        },
      },
      analyzingProject: {
        invoke: {
          src: fromPromise(analyzeProjectFlow),
          input: ({ context }) => context,
          onDone: {
            target: 'preparingTestContext',
            actions: assign(({ context, event }) => ({
              analyzedPackageJson: event.output.analyzedPackageJson,
              projectPath: context.projectPath,
              packageManager: event.output.packageManager,
            })),
          },
          onError: 'failure',
        },
      },
      preparingTestContext: {
        invoke: {
          src: fromPromise(prepareTestContextFlow),
          onDone: {
            target: 'creatingInitialTest',
            actions: assign(({ event }) => ({
              testExamples: event.output.testExamples,
            })),
          },
          onError: 'failure',
        },
      },
      creatingInitialTest: {
        invoke: {
          src: fromPromise(createInitialTestFlow),
          input: ({ context }) => context,
          onDone: {
            target: 'checkingTestResult',
            actions: assign(({ event }) => ({
              testResult: event.output,
            })),
          },
          onError: 'failure',
        },
      },
      checkingTestResult: {
        always: [
          { target: 'success', guard: 'testPassed' },
          { target: 'handlingTestFailure', guard: 'canRetry' },
          { target: 'failure', guard: 'cannotRetry' },
        ],
      },
      handlingTestFailure: {
        invoke: {
          src: fromPromise(handleTestFailureFlow),
          input: ({ context }) => context,
          onDone: {
            target: 'checkingTestResult',
            actions: assign(({ context, event }) => ({
              testResult: event.output,
              retries: context.retries + 1,
            })),
          },
          onError: 'failure',
        },
      },
      success: {
        type: 'final',
        entry: () => console.log('Test creation and execution succeeded.'),
      },
      failure: {
        type: 'final',
        entry: () => console.error('Test creation and execution failed.'),
      },
    },
  },
)
