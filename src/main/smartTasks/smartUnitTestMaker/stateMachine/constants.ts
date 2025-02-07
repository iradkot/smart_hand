// stateMachine/constants.ts

type ActorKeys =
  | 'analyzeFile'
  | 'classifyFile'
  | 'generateTest'
  | 'executeTest'
  | 'fixTestFailure';
/**
 * Services are the functions that the state machine will call.
 * for example, 'analyzeFile' will call the analyzeFile service/flow.
 */
export const Services = {
  analyzeFile: 'analyzeFile',
  classifyFile: 'classifyFile',
  generateTest: 'generateTest',
  executeTest: 'executeTest',
  fixTestFailure: 'fixTestFailure',
} as const satisfies Record<string, ActorKeys>;

export type ServiceKeys = keyof typeof Services;
export type ServiceValues = typeof Services[ServiceKeys];

export const States = {
  analyzingFile: 'analyzingFile',
  classifyingFile: 'classifyingFile',
  generatingTest: 'generatingTest',
  executingTest: 'executingTest',
  checkingIfFailed: 'checkingIfFailed',
  handlingFailure: 'handlingFailure',
  fixingTest: 'fixingTest',
  success: 'success',
  failure: 'failure',
} as const;
