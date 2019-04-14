/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs-extra');

const path = require(`path`);

class ChunkMapExtractorPlugin {
  constructor(options) {
    this.plugin = {name: `ChunkMapExtractorPlugin`};
    this.options = Object.assign({fileName: 'chunk-map.json'}, options);
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync(this.plugin, (stats, done) => {
      const assets = {};
      const assetsMap = {};
      // eslint-disable-next-line
      for (const chunkGroup of stats.compilation.chunkGroups) {
        if (chunkGroup.name) {
          const files = [];
          // eslint-disable-next-line
          for (const chunk of chunkGroup.chunks) {
            files.push(...chunk.files);
          }
          assets[chunkGroup.name] = files.filter(f => f.slice(-4) !== `.map`);
          assetsMap[chunkGroup.name] = files
            .filter(
              f =>
                f.slice(-4) !== `.map` &&
                f.slice(0, chunkGroup.name.length) === chunkGroup.name,
            )
            .map(filename => `/${filename}`);
        }
      }
      const outputPath = compiler.options.output.path;
      fs.writeFile(
        path.join(outputPath, this.options.fileName),
        JSON.stringify(assetsMap, null, 2),
        done,
      );
    });
  }
}

module.exports = ChunkMapExtractorPlugin;
