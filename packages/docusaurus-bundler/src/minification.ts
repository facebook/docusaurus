/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import {importSwcJsMinimizerOptions} from './importFaster';
import {getCurrentBundlerAsRspack} from './currentBundler';
import {
  getBrowserslistQueries,
  getLightningCssMinimizerOptions,
} from './browserslist';
import type {WebpackPluginInstance} from 'webpack';
import type {CurrentBundler, FasterConfig} from '@docusaurus/types';

export type MinimizersConfig = {
  faster: Pick<FasterConfig, 'swcJsMinimizer'>;
  currentBundler: CurrentBundler;
};

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

async function getJsMinimizer({
  faster,
}: MinimizersConfig): Promise<WebpackPluginInstance> {
  if (faster.swcJsMinimizer) {
    const terserOptions = await importSwcJsMinimizerOptions();
    return new TerserPlugin({
      parallel: getTerserParallel(),
      minify: TerserPlugin.swcMinify,
      terserOptions,
    });
  }

  return new TerserPlugin({
    parallel: getTerserParallel(),
    // See https://terser.org/docs/options/
    terserOptions: {
      parse: {
        // We want uglify-js to parse ecma 8 code. However, we don't want it
        // to apply any minification steps that turns valid ecma 5 code
        // into invalid ecma 5 code. This is why the 'compress' and 'output'
        // sections only apply transformations that are ecma 5 safe
        // https://github.com/facebook/create-react-app/pull/4234
        ecma: 2020,
      },
      compress: {
        ecma: 5,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        // Turned on because emoji and regex is not minified properly using
        // default. See https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    },
  });
}

function getCssMinimizer(): WebpackPluginInstance {
  return new CssMinimizerPlugin({
    minify: CssMinimizerPlugin.lightningCssMinify,
    minimizerOptions: getLightningCssMinimizerOptions(),
  });
}

async function getWebpackMinimizers(
  params: MinimizersConfig,
): Promise<WebpackPluginInstance[]> {
  return [await getJsMinimizer(params), getCssMinimizer()];
}

async function getRspackMinimizers({
  currentBundler,
}: MinimizersConfig): Promise<WebpackPluginInstance[]> {
  const rspack = getCurrentBundlerAsRspack({currentBundler});
  const swcJsMinimizerOptions = await importSwcJsMinimizerOptions();

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
    : getWebpackMinimizers(params);
}
