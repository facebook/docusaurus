/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const isWin = process.platform === 'win32';

const windowsSpecificIgnorePatterns = [
  // v1 is legacy, not really worth it to invest in making its tests work on Windows
  '/packages/docusaurus-1.x',
  '/packages/docusaurus-init-1.x',
];

const ignorePatterns = [
  '/node_modules/',
  '__fixtures__',
  '/packages/docusaurus-1.x',
  '/packages/docusaurus-init-1.x',
  '/packages/docusaurus/lib',
  '/packages/docusaurus-utils/lib',
  '/packages/docusaurus-utils-validation/lib',
  '/packages/docusaurus-plugin-content-blog/lib',
  '/packages/docusaurus-plugin-content-docs/lib',
  '/packages/docusaurus-plugin-content-pages/lib',
  '/packages/docusaurus-theme-classic/lib',
  '/packages/docusaurus-theme-classic/lib-next',
  '/packages/docusaurus-migrate/lib',
].concat(isWin ? windowsSpecificIgnorePatterns : []);

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
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
