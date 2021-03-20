/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebpackBar from 'webpackbar';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import type {Compiler, Plugin} from 'webpack';

class LogPlugin extends WebpackBar implements Plugin {
  apply(compiler: Compiler): void {
    super.apply(compiler);

    compiler.hooks.done.tap('WebpackNiceLog', (stats) => {
      if (stats.hasErrors() || stats.hasWarnings()) {
        const messages = formatWebpackMessages(
          stats.toJson({
            all: false,
            warnings: true,
            errors: true,
          }),
        );
        if (messages.errors.length) {
          console.error(`\n\n${messages.errors.join('')}`);
        }
        if (messages.warnings.length) {
          console.warn(`\n\n${messages.warnings.join('')}`);
        }
      }
    });
  }
}

export = LogPlugin;
