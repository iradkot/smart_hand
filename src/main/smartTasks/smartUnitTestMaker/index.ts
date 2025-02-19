// src/main/smartTasks/smartUnitTestMaker/index.ts

import { createActor } from 'xstate'
import { testMakerMachine } from './stateMachine/machine'
import { getMainWindow } from 'src/main/mainWindow'
import { XSTATE_UPDATE_INVOKE } from 'src/invokers/constants'

interface SmartUnitTestMakerParams {
  sessionId: string;
  directoryPath: string;
  fileContent: string;
  fileName: string;
  packageManager: string;
  maxRetries?: number;
}

/**
 * The main function that orchestrates everything via XState.
 */
export async function smartUnitTestMaker(params: SmartUnitTestMakerParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const actor = createActor(testMakerMachine, {
      input: {
        sessionId: params.sessionId,
        directoryPath: params.directoryPath,
        fileName: params.fileName,
        fileContent: params.fileContent,
        packageManager: params.packageManager,
        maxRetries: params.maxRetries ?? 2,
      },
    })

    actor.subscribe({
      next: (snapshot) => {
        const win = getMainWindow()
        if (win && !win.isDestroyed()) {
          win.webContents.send(XSTATE_UPDATE_INVOKE, JSON.stringify(snapshot))
        }
        if (snapshot.status === 'done') {
          if (snapshot.value === 'success') {
            resolve()
          } else {
            reject(snapshot.context.error ?? new Error('State machine ended in failure'))
          }
          actor.stop()
        }
      },
      error: (err) => {
        console.error('XState encountered an error:', err)
        reject(err)
        actor.stop()
      },
      complete: () => {
        console.log('XState actor completed')
      },
    })

    actor.start()
  })
}
