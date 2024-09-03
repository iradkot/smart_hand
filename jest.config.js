module.exports = {
  testEnvironment: 'jsdom', // jsdom simulates a browser environment for testing
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // optional: for setting up additional configurations
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transpile JavaScript and TypeScript files using Babel
  },
};
