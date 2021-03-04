/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebpackBar from 'webpackbar';
import {Compiler} from 'webpack';

/**
 * react-dev-utils' formatWebpackMessages but for webpack v5 - also its much shorter
 */
export function formatWebpackMessages5(stats?: {
  errors?: {message: string}[];
}): readonly string[] {
  return stats?.errors
    ?.map((obj) => obj?.message)
    .filter((err) => err !== undefined) as readonly string[];
}

export default class LogPlugin extends WebpackBar {
  apply(compiler: Compiler): void {
    super.apply(compiler);

    compiler.hooks.done.tap('DocusaurusLogPlugin', (stats) => {
      if (stats.hasErrors()) {
        formatWebpackMessages5(stats.toJson('errors-only')).forEach((message) =>
          console.log(message),
        );
      }
    });
  }
}
