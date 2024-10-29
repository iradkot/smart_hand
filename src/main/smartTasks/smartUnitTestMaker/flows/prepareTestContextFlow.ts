// src/main/smartTasks/smartUnitTestMaker/flows/prepareTestContextFlow.ts

import { loadTestExamples } from 'src/main/smartTasks/createTestTask/examples/loadTestExamples';

export const prepareTestContextFlow = async () => {
  try {
    const testExamples = await loadTestExamples();
    return { testExamples };
  } catch (error) {
    throw error;
  }
};
