/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebpackBar from 'webpackbar';
import webpack from 'webpack';
/*
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

function showError(arr) {
  console.log(`\n\n${arr.join('')}`);
}
 */

class LogPlugin extends WebpackBar {
  apply(compiler: webpack.Compiler): void {
    super.apply(compiler);

    compiler.hooks.done.tap('DocusaurusLogPlugin', (stats) => {
      if (stats.hasErrors()) {
        /*
        const messages = formatWebpackMessages(
          stats.toJson('errors-only', true),
        );
        if (messages.errors.length) {
          showError(messages.errors);
        }
         */
        console.log(stats.toJson('errors-only'))
      }
    });
  }
}

export default LogPlugin
