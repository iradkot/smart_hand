// src/main/utils/setupTestsForProject/testLibraries.ts

export interface TestLibrary {
  name: string;
  version: string;
}

export const commonTestLibraries: TestLibrary[] = [
  { name: 'jest', version: '^28.0.0' },
  { name: 'ts-jest', version: '^28.0.0' },
  { name: '@types/jest', version: '^28.0.0' },
];

export const platformTestLibraries: Record<string, TestLibrary[]> = {
  web: [
    { name: '@testing-library/react', version: '^12.0.0' },
    { name: '@testing-library/jest-dom', version: '^5.0.0' },
  ],
  'react-native': [
    { name: '@testing-library/react-native', version: '^8.0.0' },
  ],
  electron: [
    { name: 'spectron', version: '^15.0.0' },
    { name: 'jest-electron', version: '^1.0.0' },
    { name: 'babel-jest', version: '^28.0.0' },
    { name: '@babel/core', version: '^7.14.0' },
    { name: '@babel/preset-env', version: '^7.14.0' },
    { name: '@babel/preset-react', version: '^7.14.0' },
  ],
};

// Compatibility mapping based on TypeScript versions
export const tsCompatibility: Record<string, TestLibrary[]> = {
  '>=4.0.0 <5.0.0': [
    { name: 'jest', version: '^27.0.0' },
    { name: 'ts-jest', version: '^27.0.0' },
    { name: '@types/jest', version: '^27.0.0' },
    // Add more libraries as needed
  ],
  '>=5.0.0': [
    { name: 'jest', version: '^28.0.0' },
    { name: 'ts-jest', version: '^28.0.0' },
    { name: '@types/jest', version: '^28.0.0' },
    // Add more libraries as needed
  ],
};
