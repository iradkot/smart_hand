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

- **Exact Path Usage:** If additional files or context are required, specify their relative paths **exactly** as listed in the \`Available Files\` below in the \`requestedFiles\` array of your JSON response.
- **No Inference:** Do **not** infer or modify any paths. Use only the paths provided in the \`Available Files\` list.
- **JSON Response:** Your response must strictly adhere to the provided JSON schema.



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
  "requestedFiles": ["some/file/path.ts", "another/file/path.ts"]
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
- **Do not infer or alter any paths.** Use only the paths provided in the \`Available Files\` list.
- **Use the exact paths as listed**.
- **Your response must be a JSON object matching the schema provided**.

### Available Files:

${filePathsString}

### Additional Files:
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
    "description": "Your Test Description explaining why the error occurred and how to fix it",
    "instructions": "Instructions on how to run the test"
  },
  "testFileName": "yourTestFileName.test.ts",
  "testCode": "Your corrected test code here",
  "runCommand": "Your run command here",
  "requestedFiles": ["some/file/path.ts", "another/file/path.ts"]
}
\`\`\`

Provide the corrected test code in the \`testCode\` field, including any necessary imports or references.
`;
