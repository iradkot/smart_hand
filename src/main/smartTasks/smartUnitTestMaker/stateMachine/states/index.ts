import { analyzingFile } from './analyzingFile';
import { classifyingFile } from './classifyingFile';
import { generatingTest } from './generatingTest';
import { executingTest } from './executingTest';
import { checkingIfFailed } from './checkingIfFailed';
import { handlingFailure } from './handlingFailure';
import { fixingTest } from './fixingTest';
import { success } from './success';
import { failure } from './failure';
import { TestMakerStates } from '../types';


export const testMakerStates: TestMakerStates = {
  analyzingFile,
  classifyingFile,
  generatingTest,
  executingTest,
  checkingIfFailed,
  handlingFailure,
  fixingTest,
  success,
  failure,
};
