// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const customJestConfig = {
  // Use jsdom so DOM APIs work
  testEnvironment: 'jsdom',
  
  // Setup file for RTL extensions and mocks
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Handle `@/` imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(customJestConfig);
