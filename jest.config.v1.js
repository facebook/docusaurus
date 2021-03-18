/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const ignorePatterns = ['/node_modules/', '__fixtures__'];

module.exports = {
  rootDir: path.join(path.resolve(__dirname), 'packages', 'docusaurus-1.x'),
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: ['../../jest/stylelint-rule-test.js', '../../jest/polyfills.js'],
  moduleNameMapper: {
    '@docusaurus/router': 'react-router-dom',
  },
};
