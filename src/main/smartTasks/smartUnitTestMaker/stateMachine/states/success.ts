// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/success.ts

export const success = {
  type: 'final' as const,
  entry: ({ context }) => {
    console.log('✅ Success! Generated test file:', context.testGeneration?.testFileName);
  },
};
