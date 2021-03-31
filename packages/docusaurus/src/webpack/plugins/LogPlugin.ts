/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebpackBar from 'webpackbar';
import {Compiler, StatsCompilation} from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

// react-dev-utils/formatWebpackMessages does not support webpack 5 yet
// TODO remove once react-dev-utils support Webpack 5!
// see https://github.com/facebook/create-react-app/issues/9994
// TODO: is using react-dev-utils/formatWebpackMessages really useful?
export function formatWebpackMessagesWebpack5(stats?: StatsCompilation) {
  function convertStatErrors(statsErrors?: StatsCompilation['errors']) {
    return statsErrors
      ?.map((e) => e.message)
      .filter((message) => message !== undefined) as readonly string[];
  }

  return formatWebpackMessages({
    errors: convertStatErrors(stats?.errors),
    warnings: convertStatErrors(stats?.errors),
  });
}

function showError(arr) {
  console.log(`\n\n${arr.join('')}`);
}

export default class LogPlugin extends WebpackBar {
  apply(compiler: Compiler): void {
    super.apply(compiler);

    // TODO can't this be done in compile(configs) alongside the warnings???
    compiler.hooks.done.tap('DocusaurusLogPlugin', (stats) => {
      if (stats.hasErrors()) {
        const messages = formatWebpackMessagesWebpack5(
          stats.toJson('errors-only'),
        );
        if (messages.errors.length) {
          showError(messages.errors);
        }
      }
    });
  }
}
