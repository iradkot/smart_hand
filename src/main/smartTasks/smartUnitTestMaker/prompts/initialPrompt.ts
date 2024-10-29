// prompts/initialPrompt.ts

export const initialPrompt = (params: {
  fileName: string;
  fileContent: string;
  testExamples: string;
}): string => {
  return `
I need to create a unit test for the following TypeScript file.

File Name: ${params.fileName}

File Content:
\`\`\`typescript
${params.fileContent}
\`\`\`

Here are some example tests for reference:
${params.testExamples}

Please generate a comprehensive unit test for the provided file using best practices.
`;
};
