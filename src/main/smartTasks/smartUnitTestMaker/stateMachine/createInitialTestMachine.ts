import { assign, fromPromise, setup } from 'xstate'
import { generateTestFileName } from '../utils/testFileNameUtils'
import { writeFile } from '../utils/fileUtils'
import { executeTest } from '../utils/executionUtils'
import { initialPrompt } from '../prompts'
import { generateTestFile } from 'src/api/requests/aiOperationsRequests'
import {
  CreateInitialTestContext,
  CreateInitialTestInput,
  ExecuteTestInput,
  GenerateTestFileInput,
  GenerateTestFileOutput,
  TestResult,
  WriteFileInput,
} from '../types'
import { errorHandler } from 'src/main/smartTasks/smartUnitTestMaker/stateMachine/xstate.utils'

type ErrorActorEvent =
  | { type: 'xstate.error.actor.0.testMaker.analyzingProject'; error: Error }
  | { type: 'error.platform.createInitialTest.generateTestFile'; error: Error }
  | { type: 'error.platform.createInitialTest.writeFile'; error: Error }
  | { type: 'error.platform.createInitialTest.executeTest'; error: Error };

type CreateInitialTestEvent =
  | { type: 'START' }
  | { type: 'done.invoke.generateTestFile'; output: GenerateTestFileOutput }
  | { type: 'done.invoke.writeFile' }
  | { type: 'done.invoke.executeTest'; output: TestResult }
  | ErrorActorEvent;


const generateTestFileActor = fromPromise<GenerateTestFileOutput, GenerateTestFileInput>(
  async ({ input }) => {
    return await generateTestFile(input.sessionId, input.fileContent, input.prompt)
  },
)

const writeFileActor = fromPromise<void, WriteFileInput>(async ({ input }) => {
  const { directoryPath, filePath, content } = input
  await writeFile(directoryPath, filePath, content)
})

const executeTestActor = fromPromise<TestResult, ExecuteTestInput>(async ({ input }) => {
  const { packageManager, projectPath, testFilePath } = input
  return await executeTest(packageManager, projectPath, testFilePath)
})


export const createInitialTestMachine = setup({
  types: {
    context: {} as CreateInitialTestContext,
    input: {} as CreateInitialTestInput,
    events: {} as CreateInitialTestEvent,
    output: {} as TestResult,
  },
  actors: {
    generateTestFile: generateTestFileActor,
    writeFile: writeFileActor,
    executeTest: executeTestActor,
  },
}).createMachine({
  id: 'createInitialTest',
  initial: 'creatingPrompt',
  context: ({ input }) => ({
    ...input,
    prompt: '',
    testCode: '',
    testFileName: '',
    filePathsString: '',
    testResult: null,
    error: null,
  }),
  states: {
    creatingPrompt: {
      entry: assign(({ context }) => ({
        prompt: initialPrompt({
          fileName: context.fileName,
          fileContent: context.fileContent,
          testExamples: context.testExamples,
          filePathsString: context.filePathsString,
        }),
        testFileName: generateTestFileName(context.fileName),
      })),
      always: 'sendingPrompt',
    },
    sendingPrompt: {
      invoke: {
        src: 'generateTestFile',
        input: ({ context }) => ({
          sessionId: context.sessionId,
          fileContent: context.fileContent,
          prompt: context.prompt,
        }),
        onDone: {
          target: 'writingFile',
          actions: assign(({ event }) => ({
            testCode: event.output.content.testCode,
          })),
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
        input: ({ context }) => ({
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
        input: ({ context }) => ({
          packageManager: context.packageManager,
          projectPath: context.directoryPath,
          testFilePath: context.testFileName,
        }),
        onDone: [
          {
            target: 'success',
            guard: ({ event }) => event.output.success,
            actions: assign(({ event }) => ({
              testResult: event.output,
            })),
          },
          {
            target: 'failure',
            actions: assign(({ event }) => ({
              testResult: event.output,
            })),
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
      output: ({ context }) => context.testResult,
      entry: () => console.log('Test creation and execution succeeded.'),
    },
    failure: {
      type: 'final',
      output: ({ context }) => context.error,
      entry: ({ context }) => {
        console.error('Test creation and execution failed.', context.error)
      },
    },
  },
})
