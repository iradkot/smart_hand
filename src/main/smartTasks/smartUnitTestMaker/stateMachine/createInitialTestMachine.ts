import {assign, fromPromise, setup} from 'xstate';
import {generateTestFileName} from '../utils/testFileNameUtils';
import {writeFile} from '../utils/fileUtils';
import {executeTest} from '../utils/executionUtils';
import {initialPrompt} from '../prompts';
import {generateTestFile} from 'src/api/requests/aiOperationsRequests';
import {
  CreateInitialTestContext,
  CreateInitialTestInput,
  ExecuteTestInput,
  GenerateTestFileInput,
  GenerateTestFileOutput,
  TestResult,
  WriteFileInput,
} from '../types';
import {errorHandler} from './xstate.utils';

type CreateInitialTestEvent =
  | { type: 'START' }
  | { type: `xstate.done.actor.generateTestFile`; output: GenerateTestFileOutput }
  | { type: `xstate.done.actor.writeFile` }
  | { type: `xstate.done.actor.executeTest`; output: TestResult }
  | { type: `xstate.error.actor.generateTestFile`; data: Error }
  | { type: `xstate.error.actor.writeFile`; data: Error }
  | { type: `xstate.error.actor.executeTest`; data: Error }


export const createInitialTestMachine = setup({
  types: {
    context: {} as CreateInitialTestContext,
    input: {} as CreateInitialTestInput,
    events: {} as CreateInitialTestEvent,
    output: {} as TestResult,
  },
  actors: {
    generateTestFile: fromPromise<GenerateTestFileOutput, GenerateTestFileInput>(
      async ({input}) => {
        const response = await generateTestFile(
          input.sessionId,
          input.fileContent,
          input.prompt
        );
        return response;
      }
    ),
    writeFile: fromPromise<void, WriteFileInput>(async ({input}) => {
      const {directoryPath, filePath, content} = input;
      await writeFile(directoryPath, filePath, content);
    }),
    executeTest: fromPromise<TestResult, ExecuteTestInput>(async ({input}) => {
      const {packageManager, projectPath, testFilePath} = input;
      return await executeTest(packageManager, projectPath, testFilePath);
    }),
  },
  guards: {
    testSuccess: ({event}) => {
      if (event.type !== 'xstate.done.actor.executeTest') {
        return false;
      }
      return event.output.success;
    },
  },

}).createMachine({
  id: 'createInitialTest',
  initial: 'creatingPrompt',
  context: ({input}) => ({
    ...input,
    prompt: '',
    testCode: '',
    testFileName: '',
    additionalFiles: input.additionalFiles || '',
    requestedFiles: input.requestedFiles || [],
    testResult: null,
    error: null,
  }),
  states: {
    creatingPrompt: {
      entry: assign(({context}) => ({
        prompt: initialPrompt({
          fileName: context.fileName,
          fileContent: context.fileContent,
          testExamples: context.testExamples,
          filePathsString: context.filePathsString,
          additionalFiles: context.additionalFiles,
        }),
        testFileName: generateTestFileName(context.fileName),
        additionalFiles: '', // Reset to prevent accumulation
      })),
      always: 'sendingPrompt',
    },
    sendingPrompt: {
      invoke: {
        src: 'generateTestFile',
        id: 'generateTestFile', // Add id for proper event typing
        input: ({context}) => ({
          sessionId: context.sessionId,
          fileContent: context.fileContent,
          prompt: context.prompt,
        }),
        onDone: {
          target: 'writingFile',
          actions: assign(({ event }) => {
            if (event.type !== 'xstate.done.actor.generateTestFile') {
              return {};
            }
            return {
              testCode: event.output.content.testCode,
              requestedFiles: event.output.content.requestedFiles || [],
            };
          }),
        },
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
      },
    },
    writingFile: {
      invoke: {
        src: 'writeFile',
        id: 'writeFile', // Add id for proper event typing
        input: ({context}) => ({
          directoryPath: context.directoryPath,
          filePath: context.testFileName,
          content: context.testCode,
        }),
        onDone: 'executingTest',
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
      },
    },
    executingTest: {
      invoke: {
        src: 'executeTest',
        id: 'executeTest', // Add id for proper event typing
        input: ({context}) => ({
          packageManager: context.packageManager,
          projectPath: context.directoryPath,
          testFilePath: context.testFileName,
        }),
        onDone: [
          {
            guard: 'testSuccess',
            target: 'success',
            actions: assign(({event}) => {
              if (event.type !== 'xstate.done.actor.executeTest') {
                return {};
              }
              return {
                testResult: event.output,
              };
            }),
          },
          {
            target: 'failure',
            actions: assign(({event}) => {
              if (event.type !== 'xstate.done.actor.executeTest') {
                return {};
              }
              return {
                testResult: event.output,
              };
            }),
          },
        ],
        onError: {
          target: 'failure',
          actions: errorHandler,
        },
      },
    },
    success: {
      type: 'final',
      output: ({context}) => context.testResult,
      entry: () => console.log('Test creation and execution succeeded.'),
    },
    failure: {
      type: 'final',
      output: ({context}) => context.error,
      entry: ({context}) => {
        console.error('Test creation and execution failed.', context.error);
      },
    },
  },
});
