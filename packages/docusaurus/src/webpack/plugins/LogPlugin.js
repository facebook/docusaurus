/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const WebpackBar = require('webpackbar');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

function showError(arr) {
  console.log(`\n\n${arr.join('')}`);
}

class LogPlugin extends WebpackBar {
  apply(compiler) {
    super.apply(compiler);

    compiler.hooks.done.tap('WebpackNiceLog', stats => {
      if (stats.hasErrors()) {
        const messages = formatWebpackMessages(
          stats.toJson('errors-only', true),
        );
        if (messages.errors.length) {
          showError(messages.errors);
        }
      }
    });
  }
}

module.exports = LogPlugin;
