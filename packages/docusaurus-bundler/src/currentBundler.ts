/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack from 'webpack';
import WebpackBar from 'webpackbar';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import logger from '@docusaurus/logger';
import type {CurrentBundler, DocusaurusConfig} from '@docusaurus/types';

// We inject a site config slice because the Rspack flag might change place
type SiteConfigSlice = {
  future: {
    experimental_faster: Pick<
      DocusaurusConfig['future']['experimental_faster'],
      'rspackBundler'
    >;
  };
};

function isRspack(siteConfig: SiteConfigSlice): boolean {
  return siteConfig.future.experimental_faster.rspackBundler;
}

export async function getCurrentBundler({
  siteConfig,
}: {
  siteConfig: SiteConfigSlice;
}): Promise<CurrentBundler> {
  if (isRspack(siteConfig)) {
    // TODO add support for Rspack
    logger.error(
      'Rspack bundler is not supported yet, will use Webpack instead',
    );
  }
  return {
    name: 'webpack',
    instance: webpack,
  };
}

export async function getCSSExtractPlugin({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<typeof MiniCssExtractPlugin> {
  if (currentBundler.name === 'rspack') {
    throw new Error('Rspack bundler is not supported yet');
  }
  return MiniCssExtractPlugin;
}

export async function getCopyPlugin({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<typeof CopyWebpackPlugin> {
  if (currentBundler.name === 'rspack') {
    throw new Error('Rspack bundler is not supported yet');
  }
  // https://github.com/webpack-contrib/copy-webpack-plugin
  return CopyWebpackPlugin;
}

export async function getProgressBarPlugin({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<typeof WebpackBar> {
  if (currentBundler.name === 'rspack') {
    class CustomRspackProgressPlugin extends currentBundler.instance
      .ProgressPlugin {
      constructor({name}: {name: string}) {
        // TODO add support for color
        // Unfortunately the rspack.ProgressPlugin does not have a name option
        // See https://rspack.dev/plugins/webpack/progress-plugin
        // @ts-expect-error: adapt Rspack ProgressPlugin constructor
        super({prefix: name});
      }
    }
    return CustomRspackProgressPlugin as typeof WebpackBar;
  }

  return WebpackBar;
}
