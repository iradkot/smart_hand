// src/main/smartTasks/smartUnitTestMaker/index.ts

import {createActor} from 'xstate'
import {testMakerMachine} from './stateMachine/testMakerMachine'
import {logInfo} from './utils/loggingUtils'
import {TestMakerContext} from './types'
import {ContentNode} from 'src/types/pathHarvester.types'
import {inspector} from '../../inspector' // Import the shared inspector
import {handleError} from 'src/utils/ErrorHandler' // Import the updated handleError
import {BrowserWindow} from 'electron'
import {XSTATE_UPDATE_INVOKE} from "src/invokers/constants";


export async function smartUnitTestMaker(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  packageJsonPath: string,
  contentTree: ContentNode,
  packageJsonContent: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
      const mainWindow = BrowserWindow.getAllWindows()[0];

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
        error: null,
      }

      const {inspect} = inspector // Use the shared inspector

      const actor = createActor(testMakerMachine, {input, inspect})

      actor.subscribe({
        next: (snapshot) => {
          const currentState = JSON.stringify(snapshot)
          logInfo(`Transitioned to state: ${currentState}`)
          mainWindow.webContents.send(XSTATE_UPDATE_INVOKE, currentState);
          if (snapshot.status === 'done') {
            if (snapshot.value === 'success') {
              logInfo('State machine completed successfully.')
              resolve()
            } else if (snapshot.value === 'failure') {
              if (snapshot.output instanceof Error) {
                console.error('State machine failed:', snapshot.output.message)
                reject(snapshot.output)
              } else {
                console.error('State machine failed with unknown error:', snapshot.output)
                reject(new Error('Unknown error type in State Machine: undefined'))
              }
            } else {
              console.error('unknown state machine output:', snapshot.output)
              reject(new Error('Unknown state machine output'))
            }
            actor.stop()
          }
        },
        error: (error) => {
          const errorMsg = handleError(error, 'State Machine')
          console.log('error in state machineasda', errorMsg)
          mainWindow.webContents.send(XSTATE_UPDATE_INVOKE, JSON.stringify({value: errorMsg}));
          reject(new Error(errorMsg))
          actor.stop()
        },
        complete: () => {
          mainWindow.webContents.send(XSTATE_UPDATE_INVOKE, 'State machine stopped.');
          logInfo('State machine stopped.')
        },
      })

      actor.start()
      actor.send({type: 'START'})
    },
  )

}
