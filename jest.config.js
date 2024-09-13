module.exports = {
  testEnvironment: 'jsdom', // Simulates a browser environment for testing
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest for TypeScript and JSX
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JavaScript files
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-syntax-highlighter)/)', // Allow transformation of 'react-syntax-highlighter'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'], // Point to the setup file
};
