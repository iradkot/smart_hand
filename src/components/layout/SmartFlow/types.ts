type OptionValue = '' | '1' | '2' | '3'

export type StepState = {
  directoryPath: string
  option?: OptionValue
  message?: string
  copiedContent?: string
  gptAnswer?: string
}

export type TableRow = string[]

export type gptChatTableSegment = { content: TableRow[] }
export type gptChatCodeSegment = { content: string }

export type ChatEntry = {
  role: 'user' | 'gpt'
  content: string
}
