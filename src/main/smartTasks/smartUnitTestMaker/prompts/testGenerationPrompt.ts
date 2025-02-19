// src/main/smartTasks/smartUnitTestMaker/prompts/testGenerationPrompt.ts

import { LlmClassificationResult, MockDefinition } from '../types';

interface TestGenerationPromptParams {
  fileContent: string;
  classification: LlmClassificationResult;
  testFileName: string;
  mocks: MockDefinition[];
  complexityAnalysis?: {
    hasHooks?: boolean;
    hasContext?: boolean;
    hasEffects?: boolean;
    complexImports?: boolean;
  };
}

export const testGenerationPrompt = ({
  fileContent,
  classification,
  testFileName,
  mocks,
  complexityAnalysis
}: TestGenerationPromptParams): string => {
  const mocksSection = mocks.length > 0 ? `
### Mocks Available:
${mocks.map(mock => `- ${mock.modulePath} -> ${mock.mockPath}`).join('\n')}

Include these mocks in your test using:
${mocks.map(mock => `jest.mock('${mock.modulePath}', () => require('${mock.mockPath}'));`).join('\n')}
` : '';

  const complexitySection = complexityAnalysis ? `
### Complexity Analysis:
${complexityAnalysis.hasHooks ? '- Contains React hooks that need special handling' : ''}
${complexityAnalysis.hasContext ? '- Uses React context that needs to be provided' : ''}
${complexityAnalysis.hasEffects ? '- Contains effects that need cleanup' : ''}
${complexityAnalysis.complexImports ? '- Has complex imports that need careful mocking' : ''}
` : '';

  return `
Create a comprehensive test file for the following code using Jest.
The test should be saved as '${testFileName}'.

### File Type: ${classification.fileType}

${mocksSection}

${complexitySection}

### Source Code to Test:
\`\`\`typescript
${fileContent}
\`\`\`

Requirements:
1. Use Jest and appropriate testing libraries for ${classification.fileType}
2. Cover all major functionality and edge cases
3. Use the provided mocks where necessary
4. Follow testing best practices for ${classification.fileType}
5. Include proper error handling tests
6. Add meaningful test descriptions
${classification.customMockingStrategy ? `7. Follow special mocking strategy: ${classification.customMockingStrategy}` : ''}
${complexityAnalysis?.hasEffects ? '7. Ensure proper cleanup in tests' : ''}
${complexityAnalysis?.hasContext ? '8. Set up necessary context providers' : ''}

Your response should be a complete test file ready to be saved.
`;
};
