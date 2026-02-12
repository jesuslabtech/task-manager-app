// jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js app route
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  // Generate coverage and exclude logger
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/logger.ts', // <-- We exclude logger
    '!components/**/*.tsx',
    '!hooks/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],
};

module.exports = createJestConfig(customJestConfig);
