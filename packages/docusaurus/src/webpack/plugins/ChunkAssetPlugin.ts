/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Template, Compiler} from 'webpack';

const pluginName = 'chunk-asset-plugin';

class ChunkAssetPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, ({mainTemplate}) => {
      /* We modify webpack runtime to add an extra function called "__webpack_require__.gca"
      that will allow us to get the corresponding chunk asset for a webpack chunk.
      Pass it the chunkName or chunkId you want to load.
      For example: if you have a chunk named "my-chunk-name" that will map to "/0a84b5e7.c8e35c7a.js" as its corresponding output path
      __webpack_require__.gca("my-chunk-name") will return "/0a84b5e7.c8e35c7a.js"*/
      mainTemplate.hooks.requireExtensions.tap(pluginName, (source, chunk) => {
        const chunkIdToName = chunk.getChunkMaps(false).name;
        const chunkNameToId = Object.create(null);
        for (const chunkId of Object.keys(chunkIdToName)) {
          const chunkName = chunkIdToName[chunkId];
          chunkNameToId[chunkName] = chunkId;
        }
        const buf = [source];
        buf.push('');
        buf.push('// function to get chunk assets');
        buf.push(
          mainTemplate.requireFn +
            // If chunkName is passed, we convert it to chunk id
            // Note that jsonpScriptSrc is an internal webpack function
            `.gca = function(chunkId) { chunkId = ${JSON.stringify(
              chunkNameToId,
            )}[chunkId]||chunkId; return jsonpScriptSrc(chunkId); };`,
        );
        return Template.asString(buf);
      });
    });
  }
}

export default ChunkAssetPlugin;
