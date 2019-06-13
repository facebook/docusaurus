/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs-extra');
const path = require('path');

const pluginName = 'ChunkManifestPlugin';

class ChunkManifestPlugin {
  constructor(options) {
    this.options = {
      filename: 'manifest.json',
      manifestVariable: 'webpackManifest',
      inlineManifest: false,
      ...options,
    };
  }

  apply(compiler) {
    let chunkManifest;
    const {path: outputPath, publicPath} = compiler.options.output;

    // Build the chunk mapping
    compiler.hooks.afterCompile.tap(pluginName, compilation => {
      const assets = {};
      const assetsMap = {};
      // eslint-disable-next-line
      for (const chunkGroup of compilation.chunkGroups) {
        if (chunkGroup.name) {
          const files = [];
          // eslint-disable-next-line
          for (const chunk of chunkGroup.chunks) {
            files.push(...chunk.files);
          }
          assets[chunkGroup.name] = files.filter(f => f.slice(-4) !== '.map');
          assetsMap[chunkGroup.name] = files
            .filter(
              f =>
                f.slice(-4) !== '.map' &&
                f.slice(0, chunkGroup.name.length) === chunkGroup.name,
            )
            .map(filename => `${publicPath}${filename}`);
        }
      }
      chunkManifest = assetsMap;
      if (!this.options.inlineManifest) {
        const finalPath = path.resolve(outputPath, this.options.filename);
        fs.ensureDirSync(path.dirname(finalPath));
        fs.writeFileSync(finalPath, JSON.stringify(chunkManifest, null, 2));
      }
    });

    compiler.hooks.compilation.tap(pluginName, compilation => {
      // inline to html-webpack-plugin <head> tag
      if (this.options.inlineManifest) {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        const {manifestVariable} = this.options;

        hooks.alterAssetTagGroups.tap(pluginName, assets => {
          if (chunkManifest) {
            const newTag = {
              tagName: 'script',
              closeTag: true,
              attributes: {
                type: 'text/javascript',
              },
              innerHTML: `/*<![CDATA[*/window.${manifestVariable}=${JSON.stringify(
                chunkManifest,
              )};/*]]>*/`,
            };
            assets.headTags.unshift(newTag);
          }
        });
      }
    });
  }
}

module.exports = ChunkManifestPlugin;
