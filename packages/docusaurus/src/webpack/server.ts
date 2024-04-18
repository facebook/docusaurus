/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import merge from 'webpack-merge';
import {NODE_MAJOR_VERSION, NODE_MINOR_VERSION} from '@docusaurus/utils';
import WebpackBar from 'webpackbar';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {createBaseConfig} from './base';
import type {Props} from '@docusaurus/types';
import type {Configuration} from 'webpack';

export default async function createServerConfig(params: {
  props: Props;
}): Promise<{config: Configuration; serverBundlePath: string}> {
  const {props} = params;

  const baseConfig = await createBaseConfig({
    props,
    isServer: true,

    // Minification of server bundle reduces size but doubles bundle time :/
    minify: false,
  });

  const outputFilename = 'server.bundle.js';
  const serverBundlePath = path.join(props.outDir, outputFilename);

  const config = merge(baseConfig, {
    target: `node${NODE_MAJOR_VERSION}.${NODE_MINOR_VERSION}`,
    entry: {
      main: path.resolve(__dirname, '../client/serverEntry.js'),
    },
    output: {
      filename: outputFilename,
      libraryTarget: 'commonjs2',
      // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
      globalObject: 'this',
    },
    plugins: [
      // Show compilation progress bar.
      new WebpackBar({
        name: 'Server',
        color: 'yellow',
      }),
      await createStaticDirectoriesCopyPlugin(params),
    ].filter(Boolean),
  });

  return {config, serverBundlePath};
}

async function createStaticDirectoriesCopyPlugin({props}: {props: Props}) {
  const {
    outDir,
    siteDir,
    siteConfig: {staticDirectories: staticDirectoriesOption},
  } = props;

  // The staticDirectories option can contain empty directories, or non-existent
  // directories (e.g. user deleted `static`). Instead of issuing an error, we
  // just silently filter them out, because user could have never configured it
  // in the first place (the default option should always "work").
  const staticDirectories: string[] = (
    await Promise.all(
      staticDirectoriesOption.map(async (dir) => {
        const staticDir = path.resolve(siteDir, dir);
        if (
          (await fs.pathExists(staticDir)) &&
          (await fs.readdir(staticDir)).length > 0
        ) {
          return staticDir;
        }
        return '';
      }),
    )
  ).filter(Boolean);

  if (staticDirectories.length === 0) {
    return undefined;
  }

  return new CopyWebpackPlugin({
    patterns: staticDirectories.map((dir) => ({
      from: dir,
      to: outDir,
      toType: 'dir',
    })),
  });
}
