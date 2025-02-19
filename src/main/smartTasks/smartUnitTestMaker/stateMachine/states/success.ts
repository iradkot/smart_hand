// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/success.ts

import { getTestSummary } from '../../../../../api/requests/aiOperationsRequests';
import * as path from 'path';
// Updated import for fileUtils to use absolute import
import { writeFileContent } from 'src/main/utils/fileUtils';

export const success = {
  type: 'final' as const,
  entry: async ({ context }) => {
    console.log('✅ Success! Generated test file:', context.testGeneration?.testFileName);
    
    // Generate summary
    try {
      const summary = await getTestSummary(context.sessionId, context);
      const readmePath = path.join(
        path.dirname(context.testGeneration?.testFileName || ''),
        'TEST_SUMMARY.md'
      );
      await writeFileContent(context.directoryPath, readmePath, summary.content);
      console.log('📝 Test summary saved to:', readmePath);
    } catch (error) {
      console.error('Failed to generate test summary:', error);
    }
  },
};
