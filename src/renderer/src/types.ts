
export type FileContent = {
  isFile: boolean;
  content: string | null;
};

export type StepState = {
  directoryPath: string;
  option?: OptionValue;
  message?: string;
  copiedContent?: {
    folderStructure: string;
    ignoredFiles: string;
    fileContents?: FileContent[]; // Updated to reflect correct type
  };
  gptAnswer?: string;
};


export type TableRow = string[]

export type gptChatTableSegment = { content: TableRow[] }
export type gptChatCodeSegment = { content: string }

export type ChatEntry = {
  role: 'user' | 'gpt'
  content: string
}

export type OptionValue = '' | '1' | '2' | '3' | '4'
