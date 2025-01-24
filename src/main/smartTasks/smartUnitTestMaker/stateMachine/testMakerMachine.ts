    // testMakerMachine.ts

    import { setup, fromPromise, assign } from 'xstate';
    import {
      TestMakerContext,
      TestMakerInput,
      TestMakerEvent,
      TestResult,
      LlmClassificationResult,
      FileAnalysisResult,
      TestGenerationResult
    } from '../types';
    import { fileAnalysisFlow } from '../flows/fileAnalysisFlow';
    import { llmClassificationFlow } from '../flows/llmClassificationFlow';
    import { testGenerationFlow } from '../flows/testGenerationFlow';
    import { testExecutionFlow } from '../flows/testExecutionFlow';
    import { handleTestFailureFlow } from '../flows/handleTestFailureFlow';
    // Fix #1 (Cannot find module 'src/main/utils/packageUtils'):
    // Either set up a path alias in tsconfig or do a relative import like this:
    import { detectPackageManager } from '../../../utils/packageUtils';
    // ^ adjust the relative path as needed to match your real folder structure

    export const testMakerMachine = setup({
      types: {
        context: {} as TestMakerContext,
        events: {} as TestMakerEvent,
        input: {} as TestMakerInput,
      },
      // Fix #2 (cond vs. guard):
      // We'll rename cond -> guard in the final transitions.
      guards: {
        testPassed: (actorCtx) => !!actorCtx.context.testResult?.success,
        maxRetriesReached: (actorCtx) =>
          actorCtx.context.retries >= actorCtx.context.maxRetries
      },

      actors: {
        // 1) analyzeFile
        // We only need the original machine input (directoryPath, fileName) here,
        // so we define the actor’s second type param to read from `.input`.
        analyzeFile: fromPromise<FileAnalysisResult, { input: TestMakerInput }>(
          async (actorCtx) => {
            const { directoryPath, fileName } = actorCtx.input.input;
            return fileAnalysisFlow({ directoryPath, fileName });
          }
        ),

        // 2) classifyFile
        // We want the updated context (which has `analysis` after analyzing),
        // so we define the actor’s second type param as { context: TestMakerContext }
        // and read from `actorCtx.context`.
        classifyFile: fromPromise<LlmClassificationResult, { context: TestMakerContext }>(
          async (actorCtx) => {
            const { context } = actorCtx.input;
            if (!context.analysis) throw new Error('No analysis to classify');
            return llmClassificationFlow({
              sessionId: context.sessionId,
              fileContent: context.fileContent,
              analysis: context.analysis,
            });
          }
        ),

        // 3) generateTest
        // We'll do the same approach: read from actorCtx.context
        generateTest: fromPromise<TestGenerationResult, { context: TestMakerContext }>(
          async (actorCtx) => {
            const { context } = actorCtx.input;
            if (!context.classification) throw new Error('No classification to generate test');
            return testGenerationFlow({
              sessionId: context.sessionId,
              directoryPath: context.directoryPath,
              fileName: context.fileName,
              fileContent: context.fileContent,
              classification: context.classification,
            });
          }
        ),

        // 4) executeTest
        executeTest: fromPromise<TestResult, { context: TestMakerContext }>(
          async (actorCtx) => {
            const { context } = actorCtx.input;
            if (!context.testGeneration) throw new Error('No test file to execute');
            return testExecutionFlow({
              packageManager: context.packageManager,
              directoryPath: context.directoryPath,
              testFileName: context.testGeneration.testFileName,
            });
          }
        ),

        // 5) fixTestFailure
        fixTestFailure: fromPromise<TestResult, { context: TestMakerContext }>(
          async (actorCtx) => {
            const { context } = actorCtx.input;
            if (!context.testGeneration || !context.testResult) {
              throw new Error('No test file or testResult to fix');
            }
            return handleTestFailureFlow({
              sessionId: context.sessionId,
              directoryPath: context.directoryPath,
              testFileName: context.testGeneration.testFileName,
              lastError: context.testResult.errorMessage || '',
              packageManager: context.packageManager,
            });
          }
        ),
      },
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
        maxRetries: 2,
      }),
      states: {
        analyzingFile: {
          invoke: {
            src: 'analyzeFile',
            input: ({ context }) => ({ input: context }),
            onDone: {
              target: 'classifyingFile',
              actions: assign({
                analysis: ({ event }) => event.output,
              }),
            },
            onError: 'failure',
          },
        },
        classifyingFile: {
          invoke: {
            src: 'classifyFile',
            input: ({ context }) => ({ context }),
            onDone: {
              target: 'generatingTest',
              actions: assign({
                classification: ({ event }) => event.output,
              }),
            },
            onError: 'failure',
          },
        },
        generatingTest: {
          invoke: {
            src: 'generateTest',
            input: ({ context }) => ({ context }),
            onDone: {
              target: 'executingTest',
              actions: assign({
                testGeneration: ({ event }) => event.output,
              }),
            },
            onError: 'failure',
          },
        },
        executingTest: {
          invoke: {
            src: 'executeTest',
            input: ({ context }) => ({ context }),
            onDone: {
              target: 'checkingIfFailed',
              actions: assign({
                testResult: ({ event }) => event.output as TestResult,
              }),
            },
            onError: 'failure',
          },
        },

        checkingIfFailed: {
          always: [
            {
              target: 'success',
              // Fix #2: Use "guard" in code, not "cond".
              guard: (actorCtx) => !!actorCtx.context.testResult?.success,
            },
            {
              target: 'handlingFailure',
            },
          ],
        },

        handlingFailure: {
          entry: assign({
            retries: ({ context }) => context.retries + 1,
          }),
          always: [
            {
              target: 'failure',
              guard: (actorCtx) => actorCtx.context.retries >= actorCtx.context.maxRetries,
            },
            {
              target: 'fixingTest',
            },
          ],
        },
        fixingTest: {
          invoke: {
            src: 'fixTestFailure',
            input: ({ context }) => ({ context }),
            onDone: {
              target: 'executingTest',
              actions: assign({
                testResult: ({ event }) => event.output as TestResult,
              }),
            },
            onError: 'failure',
          },
        },
        success: {
          type: 'final',
          entry: () => {
            console.log('✅ All tests passed successfully!');
          },
        },
        failure: {
          type: 'final',
          // Fix #4: remove references to `event.data` if we are not defining it.
          // We only log from context.
          entry: ({ context }) => {
            console.log('❌ Test creation/execution failed.');
            if (context.testResult?.errorMessage) {
              console.log('Last test error:', context.testResult.errorMessage);
            }
          },
        },
      },
    });
