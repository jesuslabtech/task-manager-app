// jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Route to app Next.js
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  // Cobertura
  collectCoverage: true, // Change to false if you don't want coverage
  coverageProvider: 'v8', // ✅ Avoid babel-plugin-istanbul and test-exclude
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/logger.ts',
    '!lib/metrics.ts',
    '!components/**/*.tsx',
    '!hooks/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],

  // We do not need complicated transformIgnorePatterns
  // Jest + next/jest handles this well by default, so we can keep it simple
};

module.exports = createJestConfig(customJestConfig);
