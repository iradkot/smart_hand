import {OptionValue} from "../types/types";

export interface OptionData {
  value: OptionValue
  label: string
}

export const OPTION_COPY_FILE_CONTENTS = '1'
export const OPTION_ONLY_COPY_STRUCTURE = '2'
export const OPTION_CONSULT_GPT = '3'
export const OPTION_SHOW_REACT_NATIVE_LOGS = '4'
export const optionsData: OptionData[] = [
  {value: OPTION_COPY_FILE_CONTENTS, label: 'Copy file contents along with structure'},
  {value: OPTION_ONLY_COPY_STRUCTURE, label: 'Only copy the file and folder structure'},
  {value: OPTION_CONSULT_GPT, label: 'Consult GPT for code review or questions'},
  {value: OPTION_SHOW_REACT_NATIVE_LOGS, label: 'Show React Native logs'},
]
