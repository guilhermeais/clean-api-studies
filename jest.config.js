
module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/{!(*-protocols),}.ts', '!<rootDir>/src/main/**', '!**/test/**', '!**/protocols/**', '!**/models/**', '!**/usecases/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
