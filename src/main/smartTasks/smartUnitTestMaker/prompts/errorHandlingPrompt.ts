// prompts/errorHandlingPrompt.ts

export const errorHandlingPrompt = (params: {
  previousTestCode: string;
  errorMessage: string;
  additionalFiles?: string;
}): string => {
  return `
The previously generated test code did not pass. Here is the test code:

\`\`\`typescript
${params.previousTestCode}
\`\`\`

It failed with the following error:

\`\`\`
${params.errorMessage}
\`\`\`

${params.additionalFiles ? `Additional Files:\n${params.additionalFiles}` : ''}

Please revise the test code to fix the errors and ensure that it passes all tests.
`;
};
