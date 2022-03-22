/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack, {type Compiler} from 'webpack';

const pluginName = 'chunk-asset-plugin';

/**
 * We modify webpack runtime to add an extra function called
 * "__webpack_require__.gca" that will allow us to get the corresponding chunk
 * asset for a webpack chunk. Pass it the chunkName or chunkId you want to load.
 * For example: if you have a chunk named "my-chunk-name" that will map to
 * "/publicPath/0a84b5e7.c8e35c7a.js" as its corresponding output path
 * __webpack_require__.gca("my-chunk-name") will return
 * "/publicPath/0a84b5e7.c8e35c7a.js"
 *
 * "gca" stands for "get chunk asset"
 */
export default class ChunkAssetPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(pluginName, ({mainTemplate}) => {
      mainTemplate.hooks.requireExtensions.tap(pluginName, (source, chunk) => {
        const chunkIdToName = chunk.getChunkMaps(false).name;
        const chunkNameToId = Object.fromEntries(
          Object.entries(chunkIdToName).map(([chunkId, chunkName]) => [
            chunkName,
            chunkId,
          ]),
        );
        const buf = [source];
        buf.push('// function to get chunk asset');
        buf.push(
          // If chunkName is passed, we convert it to chunk asset url
          // .p => public path url ("/" or "/baseUrl/")
          // .u(chunkId) =>
          //   chunk asset url ("assets/js/x63b64xd.contentHash.js")
          // not sure where this is documented, but this link was helpful:
          // https://programmer.help/blogs/5d68849083e1a.html
          //
          // Note: __webpack_require__.gca() is called in docusaurus.ts for
          // prefetching
          // Note: we previously used jsonpScriptSrc (Webpack 4)
          `__webpack_require__.gca = function(chunkId) { chunkId = ${JSON.stringify(
            chunkNameToId,
          )}[chunkId]||chunkId; return __webpack_require__.p + __webpack_require__.u(chunkId); };`,
        );
        return webpack.Template.asString(buf);
      });
    });
  }
}
