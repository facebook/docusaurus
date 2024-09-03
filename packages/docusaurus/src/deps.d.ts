/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'react-loadable-ssr-addon-v5-slorber' {
  import type {WebpackPluginInstance, Compiler} from 'webpack';

  type Asset = {
    file: string;
    hash: string;
    publicPath: string;
    integrity: string;
  };

  export type Manifest = {
    entrypoints: string[];
    origins: {[key: string]: number[]};
    assets: {[key: string]: Asset[]}[];
  };

  export function getBundles(
    manifest: Manifest,
    modulesToBeLoaded: string[],
  ): {js?: Asset[]; css?: Asset[]};

  export default class ReactLoadableSSRAddon implements WebpackPluginInstance {
    constructor(props: {filename: string});
    apply(compiler: Compiler): void;
  }
}

declare module 'webpack/lib/HotModuleReplacementPlugin' {
  import type {HotModuleReplacementPlugin} from 'webpack';

  export default HotModuleReplacementPlugin;
}

// TODO incompatible declaration file: https://github.com/unjs/webpackbar/pull/108
declare module 'webpackbar' {
  import webpack from 'webpack';

  export default class WebpackBarPlugin extends webpack.ProgressPlugin {
    constructor(options: {name: string; color?: string});
  }
}

// TODO incompatible declaration file
declare module 'eta' {
  export const defaultConfig: object;

  export function compile(
    template: string,
    options?: object,
  ): (data: object, config: object) => string;
}
