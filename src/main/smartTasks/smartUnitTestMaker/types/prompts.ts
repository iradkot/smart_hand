// src/main/smartTasks/smartUnitTestMaker/types/prompts.ts

/**
 * Example prompt input types, if you want them typed.
 */
export interface ClassificationPromptParams {
  fileContent: string;
  importsList: string[];
}

export interface ErrorHandlingPromptParams {
  previousTestCode: string;
  errorMessage: string;
}

export interface TestGenerationPromptParams {
  fileContent: string;
  classification: {
    fileType: string;
    mocksNeeded: string[];
  };
  testFileName: string;
}
