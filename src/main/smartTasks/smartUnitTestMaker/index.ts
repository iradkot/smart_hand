// index.ts

import { createActor } from 'xstate';
import { testMakerMachine } from './stateMachine/testMakerMachine';

interface SmartUnitTestMakerParams {
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  packageManager: string;
  maxRetries?: number;
}

/**
 * The main function that orchestrates everything via XState.
 */
export async function smartUnitTestMaker(params: SmartUnitTestMakerParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const actor = createActor(
      testMakerMachine,
      {
        input: {
          sessionId: params.sessionId,
          directoryPath: params.directoryPath,
          fileName: params.fileName,
          fileContent: params.fileContent,
          packageManager: params.packageManager,
          maxRetries: params.maxRetries ?? 2,
        },
      }
    );

    actor.subscribe({
      next: (snapshot) => {
        // The machine transitions
        if (snapshot.status === 'done') {
          // If final state is 'success', we resolve. If it's 'failure', we reject.
          if (snapshot.value === 'success') {
            resolve();
          } else {
            // If it's 'failure', check if there's an error
            // The machine logs the error, but let's also throw
            reject(new Error('State machine ended in failure'));
          }
          actor.stop();
        }
      },
      error: (err) => {
        console.error('XState encountered an error:', err);
        reject(err);
        actor.stop();
      },
      complete: () => {
        console.log('XState actor completed');
        // Usually won't happen if we have a final state
      },
    });

    // Start!
    actor.start();
  });
}
