/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import StaticSiteGeneratorPlugin from '@endiliey/static-site-generator-webpack-plugin';
import {Configuration} from 'webpack';
import merge from 'webpack-merge';

import {Props} from '@docusaurus/types';
import {createBaseConfig} from './base';
import WaitPlugin from './plugins/WaitPlugin';
import LogPlugin from './plugins/LogPlugin';

export default function createServerConfig({
  props,
  minify = true,
  onLinksCollected = () => {},
}: {
  props: Props;
  minify?: boolean;
  onLinksCollected?: (staticPagePath: string, links: string[]) => void;
}): Configuration {
  const {
    baseUrl,
    routesPaths,
    generatedFilesDir,
    headTags,
    preBodyTags,
    postBodyTags,
  } = props;
  const config = createBaseConfig(props, true, minify);

  const routesLocation = {};
  // Array of paths to be rendered. Relative to output directory
  const ssgPaths = routesPaths.map((str) => {
    const ssgPath =
      baseUrl === '/' ? str : str.replace(new RegExp(`^${baseUrl}`), '/');
    routesLocation[ssgPath] = str;
    return ssgPath;
  });
  const serverConfig = merge(config, {
    entry: {
      main: path.resolve(__dirname, '../client/serverEntry.js'),
    },
    output: {
      filename: 'server.bundle.js',
      libraryTarget: 'commonjs2',
      // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
      globalObject: 'this',
    },
    target: 'node',
    plugins: [
      // Wait until manifest from client bundle is generated
      new WaitPlugin({
        filepath: path.join(generatedFilesDir, 'client-manifest.json'),
      }),

      // Static site generator webpack plugin.
      new StaticSiteGeneratorPlugin({
        entry: 'main',
        locals: {
          baseUrl,
          generatedFilesDir,
          routesLocation,
          headTags,
          preBodyTags,
          postBodyTags,
          onLinksCollected,
        },
        paths: ssgPaths,
      }),

      // Show compilation progress bar.
      new LogPlugin({
        name: 'Server',
        color: 'yellow',
      }),
    ],
  });
  return serverConfig;
}
