/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import RawSource from 'webpack-sources/lib/RawSource';
import evaluate from 'eval';
import pMap from 'p-map';
import type webpack from 'webpack';
import type {ServerEntryParams} from '../types';

const pluginName = 'static-site-generator-webpack-plugin';

// Not easy to define a reasonable option default
// Will still be better than Infinity
// See also https://github.com/sindresorhus/p-map/issues/24
const DefaultConcurrency = 32;

type Options = {
  entry: string;
  locals: ServerEntryParams;
  paths: string[];
  preferFoldersOutput?: boolean;
  globals: {[key: string]: unknown};
  concurrency?: number;
};

type Renderer = (locals: ServerEntryParams) => Promise<string>;

/**
 * This plugin the result of the re-internalization of an external dependency.
 * Initial code comes from:
 * - Original project: https://github.com/markdalgleish/static-site-generator-webpack-plugin
 * - Our 2022-2024: https://github.com/slorber/static-site-generator-webpack-plugin
 *
 * This dependency is not maintained anymore, and keeping code outside
 * Docusaurus only adds friction to modify/simplify/optimize this logic.
 * Note that we'll likely want to decouple this SSG logic from Webpack some day.
 */
export default class StaticSiteGeneratorWebpackPlugin
  implements webpack.WebpackPluginInstance
{
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  apply(compiler: webpack.Compiler): void {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.optimizeAssets.tapAsync(pluginName, (_, done) => {
        handleSSG(compilation, this.options).then(
          () => {
            done();
          },
          (err) => {
            compilation.errors.push(err.stack);
            done();
          },
        );
      });
    });
  }
}

async function handleSSG(
  compilation: webpack.Stats['compilation'],
  options: Options,
) {
  const concurrency = options.concurrency ?? DefaultConcurrency;

  const webpackStats = compilation.getStats();
  const {entrySource, assets} = extractFromStats({
    entry: options.entry,
    stats: webpackStats,
  });

  const render = getRenderer(entrySource.source(), options);

  return pMap(
    options.paths,
    (outputPath) =>
      renderPath({
        outputPath,
        render,
        assets,
        options,
        webpackStats,
        compilation,
      }),
    {concurrency},
  );
}

function findAsset(
  entry: string,
  compilation: webpack.Stats['compilation'],
  webpackStatsJson: webpack.StatsCompilation,
) {
  const asset = compilation.assets[entry];
  if (asset) {
    return asset;
  }

  const chunkValues = webpackStatsJson.assetsByChunkName?.[entry];
  if (!chunkValues) {
    return undefined;
  }

  // Is the main bundle always the first element?
  const chunkValue = chunkValues.find((filename) => /\.js$/.test(filename));
  if (!chunkValue) {
    return undefined;
  }

  return compilation.assets[chunkValue];
}

// Shamelessly stolen from html-webpack-plugin - Thanks @ampedandwired :)
function getAssetsFromCompilation(
  compilation: webpack.Stats['compilation'],
  webpackStatsJson: webpack.StatsCompilation,
): {[key: string]: string} {
  const result: {[key: string]: string} = {};

  Object.entries(webpackStatsJson.assetsByChunkName ?? {}).forEach(
    ([chunkName, chunkAssets]) => {
      // Is the main bundle always the first JS element?
      let chunkValue = chunkAssets.find((filename) => /\.js$/.test(filename));
      if (!chunkValue) {
        return;
      }

      if (compilation.options.output.publicPath) {
        chunkValue = compilation.options.output.publicPath + chunkValue;
      }

      result[chunkName] = chunkValue!;
    },
  );

  return result;
}

function extractFromStats({
  entry,
  stats,
}: {
  entry: string;
  stats: webpack.Stats;
}) {
  const {compilation} = stats;
  const webpackStats = compilation.getStats();
  const webpackStatsJson = webpackStats.toJson(
    {all: false, assets: true},
    // @ts-expect-error: TODO fix type
    true,
  );
  const entrySource = findAsset(entry, compilation, webpackStatsJson);
  if (entrySource == null) {
    throw new Error(`Source file not found: "${entry}"`);
  }
  const assets = getAssetsFromCompilation(compilation, webpackStatsJson);
  return {entrySource, assets};
}

function getRenderer(entrySource: string | Buffer, options: Options): Renderer {
  let render = evaluate(
    entrySource,
    /* filename: */ options.entry,
    /* scope: */ options.globals,
    /* includeGlobals: */ true,
  ) as any;

  if (render.hasOwnProperty('default')) {
    render = render.default;
  }

  if (typeof render !== 'function') {
    throw new Error(
      `Export from "${options.entry}" must be a function that returns an HTML string. Is output.libraryTarget in the configuration set to "umd"?`,
    );
  }
  return render;
}

function pathToAssetName({
  outputPath,
  preferFoldersOutput,
}: {
  outputPath: string;
  preferFoldersOutput?: boolean;
}): string {
  const outputFileName = outputPath.replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server

  // Paths ending with .html are left untouched
  if (/\.html?$/i.test(outputFileName)) {
    return outputFileName;
  }

  // Legacy retro-compatible behavior
  if (typeof preferFoldersOutput === 'undefined') {
    return path.join(outputFileName, 'index.html');
  }

  // New behavior: we can say if we prefer file/folder output
  // Useful resource: https://github.com/slorber/trailing-slash-guide
  if (outputPath === '' || outputPath.endsWith('/') || preferFoldersOutput) {
    return path.join(outputFileName, 'index.html');
  }
  return `${outputFileName}.html`;
}

async function renderPath({
  outputPath,
  render,
  assets,
  webpackStats,
  compilation,
  options,
}: {
  outputPath: string;
  render: Renderer;
  assets: any; // TODO type
  webpackStats: webpack.Stats;
  compilation: webpack.Stats['compilation'];
  options: Options;
}): Promise<void> {
  const renderLocals = {
    path: outputPath,
    assets,
    webpackStats,
    ...options.locals,
  };

  return render(renderLocals)
    .then((output) => {
      const outputByPath =
        // TODO why object output?
        typeof output === 'object' ? output : {[outputPath]: output};

      Object.keys(outputByPath).forEach((key) => {
        const rawSource = outputByPath[key];
        const assetName = pathToAssetName({
          outputPath: key,
          preferFoldersOutput: options.preferFoldersOutput,
        });
        if (compilation.assets[assetName]) {
          return;
        }

        // @ts-expect-error: TODO fix types
        compilation.assets[assetName] = new RawSource(rawSource);
      });
    })
    .catch((err: Error) => {
      // @ts-expect-error: TODO fix types
      compilation.errors.push(err.stack);
    });
}
