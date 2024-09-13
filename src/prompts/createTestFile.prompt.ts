export const createTestFilePrompt = ({ targetDirectory, targetFile, testLibrariesTypes, additionalTypes }) => `
Create a unit test for the attached file using **exclusively** the **TypeScript definitions provided**. The test should cover all edge cases and scenarios, and the file should be placed in the same directory as the original file, i.e., ${targetDirectory}.

### Key Instructions:

- The format for the test file name should be: \`targetFile.test.ts\`.
    - Example: If the target file is \`targetFile.ts\`, the test file should be \`targetFile.test.ts\`.
    - If the file includes JSX, the format should be \`targetFile.test.tsx\`.
- Only use the functions, utilities, and types explicitly defined in the \`testLibrariesTypes\`, \`additionalTypes\`, and provided types. **Do not use external libraries or functions** unless they are explicitly part of the provided types.

1. **Exclusive Use of Provided Tools and Types**: Rely solely on the tools, utilities, and definitions specified in the \`testLibrariesTypes\` and \`additionalTypes\`. Do not use any methods or assumptions beyond what is provided.

2. **Context on Theming and Providers**: Note that the components use \`styled-components\` and are wrapped with a \`ThemeProvider\` to provide theming. Use the \`ThemeProvider\` as shown in the provided types when writing tests that involve theming.

3. **Typed Component Props**: Ensure all React components and their props (e.g., \`children\`, \`theme\`) are properly typed using TypeScript. Avoid implicit \`any\` types for props.

4. **Driven by Available Types**: Base the implementation entirely on the available types. Ensure that you work only with the functionality explicitly exposed in the provided types and adapt your approach accordingly.

5. **No Assumptions About Utilities**: Avoid any assumptions about common testing utilities or methods. Explore what is provided in the types, and only use those for validating the behavior and scenarios of the attached file.

6. **Cover Edge Cases**: Ensure that the tests cover a wide range of scenarios, including edge cases, invalid inputs, or boundary conditions, as can be inferred from the provided types.

7. **Imports and Definitions**: Ensure all imports and utilities are strictly sourced from the provided types. Use only the definitions and utilities specified in the \`testLibrariesTypes\` and \`additionalTypes\`.

8. **Invalid Test Cases**: Any attempt to use methods, matchers, or tools not present in the \`testLibrariesTypes\` or \`additionalTypes\` will result in an invalid test. Ensure that every function used in your test is accounted for in the provided types.

### Types for Test Libraries:
${testLibrariesTypes}

### Additional Types and Context:
${additionalTypes}

### File to Test:
${targetFile}

**Reminder**: Only use the provided types and definitions. Do not assume additional libraries or tools beyond those explicitly defined. Your test must strictly adhere to the available types for all aspects, including imports.
`;
