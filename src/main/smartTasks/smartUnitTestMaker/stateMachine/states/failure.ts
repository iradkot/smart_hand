// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/failure.ts

export const failure = {
  type: 'final' as const,
  entry: ({ context }) => {
    console.error('❌ Failure after', context.retries, 'retries');
    console.error('Last error:', context.error ?? context.testResult?.errorMessage);
  },
};
