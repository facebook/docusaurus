/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import MinimizerPlugin from 'minimizer-webpack-plugin';
import {rspack} from './rspack';
import {
  getBrowserslistQueries,
  getLightningCssMinimizerOptions,
} from './browserslist';
import type * as MinifyFunctions from './minifyFunctions';
import type {JsMinifyOptions} from '@swc/core';
import type {
  RspackPluginInstance,
  SwcJsMinimizerRspackPluginOptions,
} from '@rspack/core';
import type {WebpackPluginInstance} from 'webpack';
import type {CurrentBundler} from '@docusaurus/types';

export type MinimizersConfig = {
  currentBundler: CurrentBundler;
};

type RspackSwcJsMinimizerOptions = NonNullable<
  SwcJsMinimizerRspackPluginOptions['minimizerOptions']
>;

// Shared by Webpack and Rspack, compatible with both SWC and Rspack types
// Rspack only accepts a subset of the SWC JS minifier options
// See https://swc.rs/docs/configuration/minification
// See https://rspack.rs/plugins/rspack/swc-js-minimizer-rspack-plugin#minimizeroptions
const SwcJsMinimizerOptions = {
  ecma: 2020,
  compress: {
    ecma: 5,
  },
  module: true,
  mangle: true,
  format: {
    ecma: 5,
    comments: false,
    ascii_only: true,
  },
} as const satisfies RspackSwcJsMinimizerOptions;

// The env variable keeps its historical name (Terser is not used anymore)
// See https://github.com/webpack/minimizer-webpack-plugin#parallel
function getMinimizerParallel() {
  let minimizerParallel: boolean | number = true;
  if (process.env.TERSER_PARALLEL === 'false') {
    minimizerParallel = false;
  } else if (
    process.env.TERSER_PARALLEL &&
    parseInt(process.env.TERSER_PARALLEL, 10) > 0
  ) {
    minimizerParallel = parseInt(process.env.TERSER_PARALLEL, 10);
  }
  return minimizerParallel;
}

// Minify functions are referenced by module path, so that the plugin's
// worker processes can require them
// The extension is .ts when running tests on source files
// See https://github.com/webpack/minimizer-webpack-plugin#minify
function getMinifyFunction(name: keyof typeof MinifyFunctions) {
  const extension = path.extname(__filename);
  return {
    path: path.join(__dirname, `minifyFunctions${extension}`),
    export: name,
  };
}

function getJsMinimizer(): WebpackPluginInstance {
  return new MinimizerPlugin<JsMinifyOptions>({
    parallel: getMinimizerParallel(),
    minify: {
      implementation: getMinifyFunction('swcMinify'),
      options: {...SwcJsMinimizerOptions, safari10: true},
    },
  });
}

function getCssMinimizer(): WebpackPluginInstance {
  return new MinimizerPlugin({
    // The plugin's default test only matches JS files
    test: /\.css(?:\?.*)?$/i,
    parallel: getMinimizerParallel(),
    minify: {
      implementation: getMinifyFunction('lightningCssMinify'),
      options: getLightningCssMinimizerOptions(),
    },
  });
}

function getWebpackMinimizers(): WebpackPluginInstance[] {
  return [getJsMinimizer(), getCssMinimizer()];
}

function getRspackMinimizers(): RspackPluginInstance[] {
  return [
    // See https://rspack.dev/plugins/rspack/swc-js-minimizer-rspack-plugin
    // See https://swc.rs/docs/configuration/minification
    new rspack.SwcJsMinimizerRspackPlugin({
      minimizerOptions: {
        minify: true,
        ...SwcJsMinimizerOptions,
      },
    }),
    new rspack.LightningCssMinimizerRspackPlugin({
      minimizerOptions: {
        // Rspack takes Browserslist queries directly
        // While LightningCSS targets are normally not Browserslist queries
        // See https://rspack.dev/plugins/rspack/lightning-css-minimizer-rspack-plugin#minimizeroptions
        // See https://lightningcss.dev/transpilation.html
        targets: getBrowserslistQueries(),
      },
    }),
  ];
}

export async function getMinimizers(
  params: MinimizersConfig,
): Promise<WebpackPluginInstance[]> {
  return params.currentBundler.name === 'rspack'
    ? // Docusaurus bundler configs are typed with Webpack types
      (getRspackMinimizers() as unknown as WebpackPluginInstance[])
    : getWebpackMinimizers();
}
