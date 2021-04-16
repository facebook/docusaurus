/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebpackBar from 'webpackbar';
import {Compiler} from 'webpack';
// import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import formatWebpackMessages from '../react-dev-utils-webpack5/formatWebpackMessages';

function showError(arr) {
  console.log(`\n\n${arr.join('\n')}`);
}

export default class LogPlugin extends WebpackBar {
  apply(compiler: Compiler): void {
    super.apply(compiler);

    // TODO can't this be done in compile(configs) alongside the warnings???
    compiler.hooks.done.tap('DocusaurusLogPlugin', (stats) => {
      if (stats.hasErrors()) {
        const messages = formatWebpackMessages(stats.toJson('errors-warnings'));
        if (messages.errors.length) {
          showError(messages.errors);
        }
      }
    });
  }
}
