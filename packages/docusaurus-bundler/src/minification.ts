/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {rspack} from './rspack';
import {
  getBrowserslistQueries,
  getLightningCssMinimizerOptions,
} from './browserslist';
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

// See https://github.com/webpack-contrib/terser-webpack-plugin#parallel
function getTerserParallel() {
  let terserParallel: boolean | number = true;
  if (process.env.TERSER_PARALLEL === 'false') {
    terserParallel = false;
  } else if (
    process.env.TERSER_PARALLEL &&
    parseInt(process.env.TERSER_PARALLEL, 10) > 0
  ) {
    terserParallel = parseInt(process.env.TERSER_PARALLEL, 10);
  }
  return terserParallel;
}

// Terser is not used: terser-webpack-plugin only runs the SWC minifier
async function getJsMinimizer(): Promise<WebpackPluginInstance> {
  const {default: TerserPlugin} = await import('terser-webpack-plugin');
  return new TerserPlugin<JsMinifyOptions>({
    parallel: getTerserParallel(),
    minify: TerserPlugin.swcMinify,
    terserOptions: {...SwcJsMinimizerOptions, safari10: true},
  });
}

async function getCssMinimizer(): Promise<WebpackPluginInstance> {
  const {default: CssMinimizerPlugin} =
    await import('css-minimizer-webpack-plugin');
  return new CssMinimizerPlugin({
    minify: CssMinimizerPlugin.lightningCssMinify,
    minimizerOptions: getLightningCssMinimizerOptions(),
  });
}

// Webpack-only minimizers are imported lazily, only when Webpack is used
async function getWebpackMinimizers(): Promise<WebpackPluginInstance[]> {
  return Promise.all([getJsMinimizer(), getCssMinimizer()]);
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
