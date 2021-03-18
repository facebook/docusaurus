/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const testMatch = [
  '**/packages/docusaurus-1.x/**/__tests__/**/*.[jt]s?(x)',
  '**/packages/docusaurus-1.x/**/?(*.)+(spec|test).[jt]s?(x)',
  '**/packages/docusaurus-init-1.x/**/__tests__/**/*.[jt]s?(x)',
  '**/packages/docusaurus-init-1.x/**/?(*.)+(spec|test).[jt]s?(x)',
];

const ignorePatterns = ['/node_modules/', '__fixtures__'];

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  testMatch,
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: ['./jest/stylelint-rule-test.js', './jest/polyfills.js'],
  moduleNameMapper: {
    '@docusaurus/router': 'react-router-dom',
  },
};
