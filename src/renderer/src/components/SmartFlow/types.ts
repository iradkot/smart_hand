type OptionValue = '' | '1' | '2' | '3'


export type StepState = {
  directoryPath: string
  option?: OptionValue
  message?: string
  copiedContent?: string
  gptAnswer?: string
}

export type TableRow = string[]

