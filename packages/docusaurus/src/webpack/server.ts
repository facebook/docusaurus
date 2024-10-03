/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import merge from 'webpack-merge';
import {NODE_MAJOR_VERSION, NODE_MINOR_VERSION} from '@docusaurus/utils';
import {getProgressBarPlugin} from '@docusaurus/bundler';
import {createBaseConfig} from './base';
import type {ConfigureWebpackUtils, Props} from '@docusaurus/types';
import type {Configuration} from 'webpack';

export default async function createServerConfig({
  props,
  configureWebpackUtils,
}: {
  props: Props;
  configureWebpackUtils: ConfigureWebpackUtils;
}): Promise<{config: Configuration; serverBundlePath: string}> {
  const baseConfig = await createBaseConfig({
    props,
    isServer: true,
    minify: false,
    faster: props.siteConfig.future.experimental_faster,
    configureWebpackUtils,
  });

  const ProgressBarPlugin = await getProgressBarPlugin({
    currentBundler: props.currentBundler,
  });

  const outputFilename = 'server.bundle.js';
  const outputDir = path.join(props.outDir, '__server');
  const serverBundlePath = path.join(outputDir, outputFilename);

  const config = merge(baseConfig, {
    target: `node${NODE_MAJOR_VERSION}.${NODE_MINOR_VERSION}`,
    entry: {
      main: path.resolve(__dirname, '../client/serverEntry.js'),
    },
    output: {
      path: outputDir,
      filename: outputFilename,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new ProgressBarPlugin({
        name: 'Server',
        color: 'yellow',
      }),
    ],
  });

  return {config, serverBundlePath};
}
