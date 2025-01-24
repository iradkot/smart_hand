// prompts/errorHandlingPrompt.ts

export function errorHandlingPrompt(params: {
  previousTestCode: string;
  errorMessage: string;
}): string {
  return `
The previously generated test code did not pass. Here is the test code:

\`\`\`typescript
${params.previousTestCode}
\`\`\`

It failed with the following error:

\`\`\`
${params.errorMessage}
\`\`\`

Please revise the test code to fix the errors and ensure that it passes all tests.

Return JSON in the format:
{
  "testCode": " ... revised test code ..."
}
`;
}
