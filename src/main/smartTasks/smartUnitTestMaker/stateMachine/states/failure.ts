// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/failure.ts

import { getTestSummary } from 'src/api/requests/aiOperationsRequests';
import * as path from 'path';
// Updated import for fileUtils to use absolute imports
import { writeFileContent } from 'src/main/utils/fileUtils';

export const failure = {
  type: 'final' as const,
  entry: async ({ context }) => {
    console.error('❌ Failure after', context.retries, 'retries');
    console.error('Last error:', context.error ?? context.testResult?.errorMessage);
    
    // Generate failure summary
    try {
      const summary = await getTestSummary(context.sessionId, context);
      const readmePath = path.join(
        path.dirname(context.fileName),
        'TEST_FAILURE_SUMMARY.md'
      );
      await writeFileContent(context.directoryPath, readmePath, summary.content);
      console.log('📝 Test failure summary saved to:', readmePath);
    } catch (error) {
      console.error('Failed to generate test failure summary:', error);
    }
  },
};
