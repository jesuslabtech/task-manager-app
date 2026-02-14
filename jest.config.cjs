// jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Route to app Next.js
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  // 👇 Only execute unit/integration tests
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx'
  ],

  // Exclude e2e tests from unit/integration test runs
  testPathIgnorePatterns: [
    '<rootDir>/tests/e2e/'
  ],

  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/logger.ts',
    '!lib/metrics.ts',
    '!components/**/*.tsx',
    '!hooks/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],
};


module.exports = createJestConfig(customJestConfig);
