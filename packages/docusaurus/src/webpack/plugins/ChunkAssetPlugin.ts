/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {type Compiler} from 'webpack';

const PluginName = 'Docusaurus-ChunkAssetPlugin';

/*
 Note: we previously used `MainTemplate.hooks.requireExtensions.tap()`
 But it will be removed in Webpack 6 and is not supported by Rspack
 So instead we use Webpack's builtin prefetch & preload abilities
 */
export default class ChunkAssetPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(PluginName, (compilation) => {
      compilation.hooks.additionalTreeRuntimeRequirements.tap(
        PluginName,
        (_, set) => {
          // webpack doesn't support auto inject prefetch & preload runtimeModule, so need to inject it manually
          set.add(compiler.webpack.RuntimeGlobals.prefetchChunk);
          set.add(compiler.webpack.RuntimeGlobals.preloadChunk);
        },
      );
    });
  }
}
