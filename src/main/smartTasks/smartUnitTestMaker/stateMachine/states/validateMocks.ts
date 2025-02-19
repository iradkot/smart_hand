// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/validateMocks.ts
import * as path from 'path';
import { validateFile } from 'src/main/smartTasks/smartUnitTestMaker/utils/validateMocks';

/**
 * State to validate generated mock files, such as fs.mock.ts, by running TypeScript validation.
 * It expects context to include a property `mockFilePaths` which is an array of absolute paths to mock files.
 */
export const validateMocks = {
  type: 'final',
  entry: async ({ context }: { context: any }) => {
    try {
      const mocks: string[] = context.mockFilePaths || [];
      // If no mocks provided, assume default fs.mock.ts location relative to testGeneration file.
      if (mocks.length === 0 && context.testGeneration && context.testGeneration.testFileName) {
        const defaultMockPath = path.join(
          path.dirname(context.testGeneration.testFileName),
          'fs.mock.ts'
        );
        mocks.push(defaultMockPath);
      }

      for (const mockPath of mocks) {
        console.log(`Validating mock file: ${mockPath}`);
        await validateFile(mockPath);
        console.log(`✅ Mock file validated: ${mockPath}`);
      }
    } catch (error) {
      console.error('Mock validation failed:', error);
      throw error;
    }
  },
};
