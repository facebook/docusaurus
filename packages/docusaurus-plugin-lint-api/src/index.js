/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const markdownlint = require('markdownlint');
const path = require('path');
const test1 = require('./enforce-api-structure.js');

const options = {
  files: [path.resolve(__dirname, './test.md')],
  customRules: [test1],
};
const result = markdownlint.sync(options);

module.exports = function(context, options) {
  return {
    name: 'docusaurus-plugin-docs-lint-api',
    extendCli(cli) {
      cli
        .command('lint-api')
        .description('Ensure that a  API docs follow our best practices guide')
        .action(() => {
          console.log(result)
        })
    }
  }
}
