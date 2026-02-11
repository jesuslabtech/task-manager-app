// jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // ruta a tu app Next.js
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
