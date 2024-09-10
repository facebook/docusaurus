/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack, {type Compiler} from 'webpack';

// Custom Docusaurus Webpack runtime function to convert from chunk name to url
// This generates a __webpack_require__.gca fn to the Webpack runtime chunk
// It is called in Core docusaurus.ts for chunk prefetching
// See also: https://github.com/facebook/docusaurus/pull/10485
const DocusaurusGetChunkAsset = '__webpack_require__.gca';

const PluginName = 'Docusaurus-ChunkAssetPlugin';

function generateGetChunkAssetRuntimeCode(chunk: webpack.Chunk): string {
  const chunkIdToName = chunk.getChunkMaps(false).name;
  const chunkNameToId = Object.fromEntries(
    Object.entries(chunkIdToName).map(([chunkId, chunkName]) => [
      chunkName,
      chunkId,
    ]),
  );

  const {
    // publicPath = __webpack_require__.p
    // Example: "/" or "/baseUrl/"
    // https://github.com/webpack/webpack/blob/v5.94.0/lib/runtime/PublicPathRuntimeModule.js
    publicPath,

    // getChunkScriptFilename = __webpack_require__.u
    // Example: getChunkScriptFilename("814f3328") = "814f3328.03fcc178.js"
    // https://github.com/webpack/webpack/blob/v5.94.0/lib/runtime/GetChunkFilenameRuntimeModule.js
    getChunkScriptFilename,
  } = webpack.RuntimeGlobals;

  const code = `// Docusaurus function to get chunk asset
${DocusaurusGetChunkAsset} = function(chunkId) { chunkId = ${JSON.stringify(
    chunkNameToId,
  )}[chunkId]||chunkId; return ${publicPath} + ${getChunkScriptFilename}(chunkId); };`;

  return webpack.Template.asString(code);
}

/*
 Note: we previously used `MainTemplate.hooks.requireExtensions.tap()`
 But it will be removed in Webpack 6 and is not supported by Rspack
 So instead we use equivalent code inspired by:
 - https://github.com/webpack/webpack/blob/v5.94.0/lib/RuntimePlugin.js#L462
 - https://github.com/webpack/webpack/blob/v5.94.0/lib/runtime/CompatRuntimeModule.js
 */
export default class ChunkAssetPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(PluginName, (compilation) => {
      compilation.hooks.additionalTreeRuntimeRequirements.tap(
        PluginName,
        (chunk) => {
          compilation.addRuntimeModule(chunk, new ChunkAssetRuntimeModule());
        },
      );
    });
  }
}

// Inspired by https://github.com/webpack/webpack/blob/v5.94.0/lib/runtime/CompatRuntimeModule.js
class ChunkAssetRuntimeModule extends webpack.RuntimeModule {
  constructor() {
    super('ChunkAssetRuntimeModule', webpack.RuntimeModule.STAGE_ATTACH);
    this.fullHash = true;
  }

  override generate() {
    return generateGetChunkAssetRuntimeCode(this.chunk!);
  }
}
