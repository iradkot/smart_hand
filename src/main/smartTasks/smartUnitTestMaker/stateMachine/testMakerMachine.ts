import { assign, fromPromise, setup } from 'xstate'
import { AnalyzeProjectOutput, PrepareTestContextOutput, TestMakerContext, TestMakerInput, TestResult } from '../types'
import { analyzeProjectFlow, handleTestFailureFlow, prepareTestContextFlow } from '../flows'
import { cannotRetry, canRetry, testPassed } from './guards'
import { createInitialTestMachine } from './createInitialTestMachine'
import { errorHandler } from 'src/main/smartTasks/smartUnitTestMaker/stateMachine/xstate.utils'

type ErrorEvent =
  | { type: 'error.invoke.analyzeProjectFlow'; error: unknown }
  | { type: 'error.invoke.prepareTestContextFlow'; error: unknown }
  | { type: 'error.invoke.createInitialTestMachine'; error: unknown }
  | { type: 'error.invoke.handleTestFailureFlow'; error: unknown };

type TestMakerEvent =
  | { type: 'START' }
  | { type: 'RETRY' }
  | { type: 'done.invoke.analyzeProjectFlow'; output: AnalyzeProjectOutput }
  | { type: 'done.invoke.prepareTestContextFlow'; output: PrepareTestContextOutput }
  | { type: 'done.invoke.createInitialTestMachine'; output: TestResult }
  | { type: 'done.invoke.handleTestFailureFlow'; output: TestResult }
  | ErrorEvent;

export const testMakerMachine = setup({
  types: {
    context: {} as TestMakerContext,
    input: {} as TestMakerInput,
    events: {} as
      TestMakerEvent,
  },
  guards: { testPassed, canRetry, cannotRetry },
  actors: {
    analyzeProjectFlow: fromPromise(analyzeProjectFlow),
    prepareTestContextFlow: fromPromise(prepareTestContextFlow),
    createInitialTestMachine,
    handleTestFailureFlow: fromPromise(handleTestFailureFlow),
  },
}).createMachine({
  id: 'testMaker',
  initial: 'idle',
  context: ({ input }) => ({
    ...input,
    retries: 0,
    maxRetries: 2,
    testResult: null,
    analyzedPackageJson: null,
    testExamples: '',
    packageManager: '',
    projectPath: input.packageJsonPath,
    error: null,
    filePathsString: '',
  }),
  states: {
    idle: {
      on: {
        START: 'analyzingProject',
      },
    },
    analyzingProject: {
      invoke: {
        src: 'analyzeProjectFlow',
        input: ({ context }) => context,
        onDone: {
          target: 'preparingTestContext',
          actions: assign(({ context, event }) => ({
            analyzedPackageJson: event.output.analyzedPackageJson,
            projectPath: context.projectPath,
            packageManager: event.output.packageManager,
          })),
        },
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
      },
    },
    preparingTestContext: {
      invoke: {
        src: 'prepareTestContextFlow',
        onDone: {
          target: 'creatingInitialTest',
          actions: assign(({ event }) => ({
            testExamples: event.output.testExamples,
          })),
        },
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
      },
    },
    creatingInitialTest: {
      invoke: {
        src: 'createInitialTestMachine',
        input: ({ context }) => context,
        onDone: {
          target: 'checkingTestResult',
          actions: assign(({ event }) => ({
            testResult: (event as { output: TestResult }).output,
          })),
        },
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
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
        src: 'handleTestFailureFlow',
        input: ({ context }) => context,
        onDone: {
          target: 'checkingTestResult',
          actions: assign(({ context, event }) => ({
            testResult: event.output,
            retries: context.retries + 1,
          })),
        },
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
      },
    },
    success: {
      type: 'final',
      entry: () => console.log('Test creation and execution succeeded.'),
    },
    failure: {
      type: 'final',
      output: ({ context }) => context.error,
      entry: ({ context }) => {
        if (context.error instanceof Error) {
          console.error('Test creation and execution failed.', context.error.message);
        } else {
          console.error('Test creation and execution failed.', context.error);
        }
      },
    },
  },
})
