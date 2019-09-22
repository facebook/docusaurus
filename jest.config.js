/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '__fixtures__',
    '/packages/docusaurus/lib',
    '/packages/docusaurus-utils/lib',
    '/packages/docusaurus-plugin-content-blog/lib',
    '/packages/docusaurus-types/lib',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
