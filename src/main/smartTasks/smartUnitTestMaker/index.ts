// src/main/smartTasks/smartUnitTestMaker/index.ts

import { createActor } from 'xstate'
import { testMakerMachine } from './stateMachine/testMakerMachine'
import { logInfo } from './utils/loggingUtils'
import { TestMakerContext } from './types'
import { ContentNode } from 'src/types/pathHarvester.types'
import { inspector } from '../../inspector' // Import the shared inspector
import { handleError } from 'src/utils/ErrorHandler' // Import the updated handleError

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

      const { inspect } = inspector // Use the shared inspector

      const actor = createActor(testMakerMachine, { input, inspect })

      actor.subscribe({
        next: (snapshot) => {
          logInfo(`Transitioned to state: ${JSON.stringify(snapshot.value)}`)
          if (snapshot.status === 'done') {
            if (snapshot.value  === 'success') {
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
          reject(new Error(errorMsg))
          actor.stop()
        },
      })

      actor.start()
      actor.send({ type: 'START' })
    },
  )

}
