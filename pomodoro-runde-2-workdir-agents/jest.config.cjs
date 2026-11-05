module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/setupTests.js'],
  coverageThreshold: {
    global: { branches: 75, functions: 90, lines: 90, statements: 90 },
  },
};
