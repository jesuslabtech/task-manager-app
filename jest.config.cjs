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
  collectCoverage: false,
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/logger.ts', // <-- We exclude logger
    '!lib/metrics.ts', // <-- We exclude metrics
    '!components/**/*.tsx',
    '!hooks/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],
  // Prevent issues with babel-plugin-istanbul in Node 22+
  transformIgnorePatterns: [
    'node_modules/(?!(test-exclude|@jest)/)',
  ],
};

module.exports = createJestConfig(customJestConfig);