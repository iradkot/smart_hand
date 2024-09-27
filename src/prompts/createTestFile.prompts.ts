export const createTestFilePrompt = ({
                                       targetDirectory,
                                       targetFile,
                                       fileContent,
                                       analyzedTestLibraries,
                                       testExamples
                                     }) => `
Create a unit test for the attached file using **exclusively** the **TypeScript definitions** and **test examples provided**. The test should cover all edge cases and scenarios, and the file should be placed in the same directory as the original file, i.e., ${targetDirectory}.

### Key Instructions:

- The format for the test file name should be: \`${targetFile}.test.ts\`.
    - Example: If the target file is \`${targetFile}.ts\`, the test file should be \`${targetFile}.test.ts\`.
    - If the file includes JSX, the format should be \`${targetFile}.test.tsx\`.
- Only use the functions, utilities, and types explicitly defined in the \`analyzedTestLibraries\` and provided test examples. **Do not use external libraries or functions** unless explicitly part of the provided test examples or libraries.

1. **Exclusive Use of Provided Test Libraries and Examples**: Use the utilities, types, and libraries in \`analyzedTestLibraries\` and the test example files. Do not use any external methods or assumptions beyond what is provided.

2. **Ensure Typed Components**: Ensure all React components and their props are properly typed using TypeScript. Avoid implicit \`any\` types.

3. **Cover Edge Cases**: Make sure tests cover all edge cases, boundary conditions, and invalid inputs based on the structure and scenarios provided in the examples.

4. **Test Libraries**: Only use the libraries listed in \`analyzedTestLibraries\`.

### Libraries Used:
${JSON.stringify(analyzedTestLibraries, null, 2)}

### Test Examples Provided:
${testExamples}

### File to Test:
${targetFile}
File Content:
${fileContent}

**Reminder**: Follow the types and utilities provided and ensure your test adheres to the given structures.
`;

export const handleTestRunErrorPrompt = ({ errorMessage, generatedTestFile, testCode }) => `
An error occurred while running the tests for the generated file: \`${generatedTestFile}\`.

### Error Message:
\`\`\`
${errorMessage}
\`\`\`

Please correct the test code accordingly. If you need additional files or context, specify the filenames, and they will be provided.

### Current Test Code:
\`\`\`typescript
${testCode}
\`\`\`

Provide the corrected test code in the same format as before.
`;
