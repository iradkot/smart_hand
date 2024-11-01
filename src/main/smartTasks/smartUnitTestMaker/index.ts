// src/main/smartTasks/smartUnitTestMaker/index.ts

import { createActor } from 'xstate';
import { testMakerMachine } from './stateMachine/testMakerMachine';
import { logInfo, logError } from './utils/loggingUtils';
import { TestMakerContext } from './types';
import { ContentNode } from 'src/types/pathHarvester.types';
import { inspector } from '../../inspector'; // Import the shared inspector

export async function smartUnitTestMaker(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  packageJsonPath: string,
  contentTree: ContentNode,
  packageJsonContent: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const input: TestMakerContext = {
      sessionId,
      directoryPath,
      fileContent,
      fileName,
      packageJsonPath,
      contentTree,
      packageJsonContent,
      retries: 0,
      maxRetries: 3, // Configurable
      testResult: null,
      analyzedPackageJson: null,
      testExamples: '',
      projectPath: directoryPath,
      packageManager: '', // This will be set during the machine execution
    };

    const { inspect } = inspector; // Use the shared inspector

    const actor = createActor(testMakerMachine, { input, inspect });

    actor.subscribe({
      next: (snapshot) => {
        logInfo(`Transitioned to state: ${JSON.stringify(snapshot.value)}`);
        if (snapshot.status === 'done') {
          if (snapshot.output === 'success') {
            logInfo('State machine completed successfully.');
            resolve();
          } else {
            const error = new Error('State machine terminated with failure.');
            logError(error);
            reject(error);
          }
          actor.stop();
        }
      },
      error: (error) => {
        const err = error instanceof Error ? error : new Error(String(error));
        logError(err);
        reject(err);
        actor.stop();
      },
    });

    actor.start();
    actor.send({ type: 'START' });
  });
}
