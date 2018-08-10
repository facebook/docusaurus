const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/lib/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '__fixtures__']
};
