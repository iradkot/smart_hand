interface InitialPromptParams {
  targetDirectory: string;
  targetFile: string;
  fileContent: string;
  analyzedTestLibraries: string;
  testExamples: string;
  filePathsString: string;
  additionalFilesSection: string;
}

export const createTestFilePrompt = ({
                                       targetDirectory,
                                       targetFile,
                                       fileContent,
                                       analyzedTestLibraries,
                                       testExamples,
                                       filePathsString,
                                       additionalFilesSection,
                                     }: InitialPromptParams) => `
Create a unit test for the attached file using **only** the provided definitions and test examples. Cover all edge cases and scenarios.
The test file should be placed in the same directory as the file to test (\`${targetDirectory}\`).

### Key Instructions:

- Name the test file: \`${targetFile}.test.ts\`.
- **If you require additional files or context**, specify their relative paths from the list below in the \`requestedFiles\` array of your JSON response.
- **Use the exact paths as listed.**

### Available Files:

${filePathsString}

${additionalFilesSection}

### Libraries Used:
${analyzedTestLibraries}

### Test Examples Provided:
${testExamples}

### File to Test:
${targetFile}
File Content:
${fileContent}

**Important**: Respond with a JSON object matching the provided schema. Include any needed files in the \`requestedFiles\` array.

**Example Response**:
\`\`\`json
{
  "testDescription": { /* ... */ },
  "testFileName": "yourTestFileName.test.ts",
  "testCode": "Your test code here",
  "runCommand": "Your run command here",
  "requestedFiles": ["src/utils/someUtility.ts", "src/constants/styleConstants.ts"]
}
\`\`\`
`;


interface ErrorHandlingPromptParams {
  errorMessage: string;
  generatedTestFile: string;
  testCode: string;
  filePathsString: string;
  additionalFilesSection: string;
}
export const handleTestRunErrorPrompt = ({
                                           errorMessage,
                                           generatedTestFile,
                                           testCode,
                                           filePathsString,
                                           additionalFilesSection,
                                         }: ErrorHandlingPromptParams) => `
An error occurred while running the tests for \`${generatedTestFile}\`.

### Error Message:
\`\`\`
${errorMessage}
\`\`\`

**Important Instructions**:

- **Analyze the error message carefully**.
- **If the error indicates missing files, modules, or context**, you **must** specify the relative paths of the files you need from the 'Available Files' list below in the \`requestedFiles\` array of your JSON response.
- **Use the exact paths as listed**.
- **Do not include the contents of the requested files in your response**.
- **Your response must be a JSON object matching the schema provided**.

### Available Files:

${filePathsString}

${additionalFilesSection}

### Current Test Code:
\`\`\`typescript
${testCode}
\`\`\`

**Example Response**:
\`\`\`json
{
  "testDescription": {
    "title": "Your Test Title",
    "description": "Your Test Description",
    "instructions": "Instructions on how to run the test"
  },
  "testFileName": "yourTestFileName.test.ts",
  "testCode": "Your corrected test code here",
  "runCommand": "Your run command here",
  "requestedFiles": ["src/utils/harvesterUtils.ts", "src/stateManagement/zustand/useStore.ts"]
}
\`\`\`

Provide the corrected test code in the \`testCode\` field, including any necessary imports or references.
`;
