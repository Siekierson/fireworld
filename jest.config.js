const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Ścieżka do aplikacji Next.js
  dir: './',
})

// Konfiguracja Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/api/**/*.{js,jsx,ts,tsx}',
    '!src/app/api/**/*.d.ts',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}

module.exports = createJestConfig(customJestConfig) 