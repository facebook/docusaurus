/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import {getCurrentBundlerAsRspack} from './currentBundler';
import {
  getBrowserslistQueries,
  getLightningCssMinimizerOptions,
} from './browserslist';
import type {JsMinifyOptions} from '@swc/core';
import type {CustomOptions} from 'terser-webpack-plugin';
import type {WebpackPluginInstance} from 'webpack';
import type {CurrentBundler} from '@docusaurus/types';

export type MinimizersConfig = {
  currentBundler: CurrentBundler;
};

// See https://swc.rs/docs/configuration/minification
function getSwcJsMinimizerOptions(): JsMinifyOptions {
  return {
    ecma: 2020,
    compress: {
      ecma: 5,
    },
    module: true,
    mangle: true,
    safari10: true,
    format: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  };
}

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
function getJsMinimizer(): WebpackPluginInstance {
  return new TerserPlugin<JsMinifyOptions>({
    parallel: getTerserParallel(),
    minify: TerserPlugin.swcMinify,
    terserOptions: getSwcJsMinimizerOptions(),
  });
}

function getCssMinimizer(): WebpackPluginInstance {
  return new CssMinimizerPlugin({
    minify: CssMinimizerPlugin.lightningCssMinify,
    minimizerOptions: getLightningCssMinimizerOptions(),
  });
}

function getWebpackMinimizers(): WebpackPluginInstance[] {
  return [getJsMinimizer(), getCssMinimizer()];
}

async function getRspackMinimizers({
  currentBundler,
}: MinimizersConfig): Promise<WebpackPluginInstance[]> {
  const rspack = getCurrentBundlerAsRspack({currentBundler});
  const swcJsMinimizerOptions: CustomOptions = getSwcJsMinimizerOptions();

  return [
    // See https://rspack.dev/plugins/rspack/swc-js-minimizer-rspack-plugin
    // See https://swc.rs/docs/configuration/minification
    new rspack.SwcJsMinimizerRspackPlugin({
      minimizerOptions: {
        minify: true,
        ecma: swcJsMinimizerOptions.ecma,
        ...swcJsMinimizerOptions,
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
  ] as unknown as WebpackPluginInstance[];
}

export async function getMinimizers(
  params: MinimizersConfig,
): Promise<WebpackPluginInstance[]> {
  return params.currentBundler.name === 'rspack'
    ? getRspackMinimizers(params)
    : getWebpackMinimizers();
}
