export type OptionValue = '' | '1' | '2' | '3';

export interface StepState {
  directoryPath: string;
  option?: OptionValue;
  message?: string;
  copiedContent?: string;
  gptAnswer?: string;
}
