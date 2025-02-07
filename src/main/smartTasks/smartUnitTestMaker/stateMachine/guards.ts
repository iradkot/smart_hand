
// guards.ts
export const testMakerGuards = {
  testPassed: ({ context }) => !!context.testResult?.success,
  maxRetriesReached: ({ context }) => context.retries >= context.maxRetries
};
