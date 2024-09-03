/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// TODO incompatible declaration file: https://github.com/unjs/webpackbar/pull/108
declare module 'webpackbar' {
  import webpack from 'webpack';

  export default class WebpackBarPlugin extends webpack.ProgressPlugin {
    constructor(options: {name: string; color?: string});
  }
}
