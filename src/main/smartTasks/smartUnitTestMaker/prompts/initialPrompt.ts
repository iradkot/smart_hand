// prompts/initialPrompt.ts

export const initialPrompt = (params: {
  fileName: string;
  fileContent: string;
  testExamples: string;
   filePathsString: string;
}): string => {
  return `
I need to create a unit test for the following TypeScript file.

File Name: ${params.fileName}

This is the file content that needs to be tested:
\`\`\`typescript
${params.fileContent}
\`\`\`

Here are some example tests for reference:
${params.testExamples}

if you need any additional files, please specify them in the \`requestedFiles\` array of your JSON response.
these are the available files you can request for:
${params.filePathsString}

Please generate a comprehensive unit test for the provided file using best practices.
**Example Response**:
\`\`\`json
{
  "testDescription": { /* ... */ },
  "testFileName": "yourTestFileName.test.ts",
  "testCode": "Your test code here",
  "runCommand": "Your run command here",
  "requestedFiles": ["some/file/path.ts", "another/file/path.ts"]
}
`;
};
