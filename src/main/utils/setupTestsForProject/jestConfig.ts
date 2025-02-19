// src/main/utils/setupTestsForProject/jestConfig.ts

import fs from 'fs';
import path from 'path';

export const createJestConfig = async (directoryPath: string, platform: string): Promise<void> => {
  const testEnvironment = (platform === 'web' || platform === 'electron') ? 'jsdom' : 'node';
  const jestConfig = `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '${testEnvironment}',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleDirectories: ['node_modules', '__mocks__'],
  clearMocks: true,
  restoreMocks: true
};
`.trim();

  fs.writeFileSync(path.join(directoryPath, 'jest.config.js'), jestConfig);
  console.log('Created jest.config.js.');
};

export const createJestSetup = async (directoryPath: string): Promise<void> => {
  const jestSetup = `
import '@testing-library/jest-dom';

// Reset all mocks before each test
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});
`.trim();

  fs.writeFileSync(path.join(directoryPath, 'jest-setup.ts'), jestSetup);
  console.log('Created jest-setup.ts.');
};
