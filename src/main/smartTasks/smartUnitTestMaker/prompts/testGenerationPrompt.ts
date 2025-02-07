// prompts/testGenerationPrompt.ts
import { LlmClassificationResult } from '../types';

export function testGenerationPrompt(
  fileContent: string,
  classification: LlmClassificationResult,
  testFileName: string
): string {
  return `
File Type: ${classification.fileType}
Mocks Needed: ${classification.mocksNeeded.join(', ')}

Here is the source file content:
\`\`\`typescript
${fileContent}
\`\`\`

Please generate a comprehensive unit test for this file,
naming it "${testFileName}".
Return valid JSON in this format:
{
  "testCode": " ... "
}
`;
}
