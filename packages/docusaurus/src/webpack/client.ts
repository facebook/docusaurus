/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import logger from '@docusaurus/logger';
import merge from 'webpack-merge';
import WebpackBar from 'webpackbar';
import webpack from 'webpack';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import ReactLoadableSSRAddon from 'react-loadable-ssr-addon-v5-slorber';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {createBaseConfig} from './base';
import ChunkAssetPlugin from './plugins/ChunkAssetPlugin';
import {formatStatsErrorMessage} from './utils';
import CleanWebpackPlugin from './plugins/CleanWebpackPlugin';
import type {Props} from '@docusaurus/types';
import type {Configuration} from 'webpack';

// When building, include the plugin to force terminate building if errors
// happened in the client bundle.
class ForceTerminatePlugin implements webpack.WebpackPluginInstance {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.done.tap('client:done', (stats) => {
      if (stats.hasErrors()) {
        const errorsWarnings = stats.toJson('errors-warnings');
        logger.error(
          `Client bundle compiled with errors therefore further build is impossible.\n${formatStatsErrorMessage(
            errorsWarnings,
          )}`,
        );
        process.exit(1);
      }
    });
  }
}

async function createBaseClientConfig({
  props,
  hydrate,
  minify,
}: {
  props: Props;
  hydrate: boolean;
  minify: boolean;
}): Promise<Configuration> {
  const baseConfig = await createBaseConfig({props, isServer: false, minify});

  return merge(baseConfig, {
    // Useless, disabled on purpose (errors on existing sites with no
    // browserslist config)
    // target: 'browserslist',
    entry: path.resolve(__dirname, '../client/clientEntry.js'),
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.HYDRATE_CLIENT_ENTRY': JSON.stringify(hydrate),
      }),
      new ChunkAssetPlugin(),
      // Show compilation progress bar and build time.
      new WebpackBar({
        name: 'Client',
      }),
    ],
  });
}

// client config when running "docusaurus start"
export async function createStartClientConfig({
  props,
  minify,
  poll,
}: {
  props: Props;
  minify: boolean;
  poll: number | boolean | undefined;
}): Promise<{clientConfig: Configuration}> {
  const {siteConfig, headTags, preBodyTags, postBodyTags} = props;

  const clientConfig: webpack.Configuration = merge(
    await createBaseClientConfig({
      props,
      minify,
      hydrate: false,
    }),
    {
      watchOptions: {
        ignored: /node_modules\/(?!@docusaurus)/,
        poll,
      },
      infrastructureLogging: {
        // Reduce log verbosity, see https://github.com/facebook/docusaurus/pull/5420#issuecomment-906613105
        level: 'warn',
      },
      plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
          template: path.join(__dirname, '../templates/dev.html.template.ejs'),
          // So we can define the position where the scripts are injected.
          inject: false,
          filename: 'index.html',
          title: siteConfig.title,
          headTags,
          preBodyTags,
          postBodyTags,
        }),
      ],
    },
  );

  return {clientConfig};
}

// client config when running "docusaurus build"
export async function createBuildClientConfig({
  props,
  minify,
  bundleAnalyzer,
}: {
  props: Props;
  minify: boolean;
  bundleAnalyzer: boolean;
}): Promise<{config: Configuration; clientManifestPath: string}> {
  // Apply user webpack config.
  const {generatedFilesDir} = props;

  const clientManifestPath = path.join(
    generatedFilesDir,
    'client-manifest.json',
  );

  const config: Configuration = merge(
    await createBaseClientConfig({props, minify, hydrate: true}),
    {
      plugins: [
        new ForceTerminatePlugin(),
        // Remove/clean build folders before building bundles.
        new CleanWebpackPlugin({verbose: false}),
        // Visualize size of webpack output files with an interactive zoomable
        // tree map.
        bundleAnalyzer && new BundleAnalyzerPlugin(),
        // Generate client manifests file that will be used for server bundle.
        new ReactLoadableSSRAddon({
          filename: clientManifestPath,
        }),
      ].filter(<T>(x: T | undefined | false): x is T => Boolean(x)),
    },
  );

  return {config, clientManifestPath};
}
