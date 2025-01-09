// src/main/smartTasks/smartUnitTestMaker/flows/prepareTestContextFlow.ts

import { loadTestExamples } from 'src/main/smartTasks/smartUnitTestMaker/utils/loadTestExamples'
import { handleError } from 'src/utils/ErrorHandler'

export const prepareTestContextFlow = async () => {
  try {
    const testExamples = await loadTestExamples()
    return { testExamples }
  } catch (error) {
    const errorMsg = handleError(error, 'prepareTestContextFlow')
    throw new Error(errorMsg)
  }
}
