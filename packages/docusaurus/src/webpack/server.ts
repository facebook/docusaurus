/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {Configuration} from 'webpack';
import merge from 'webpack-merge';

import {Props} from '@docusaurus/types';
import {createBaseConfig} from './base';
import WaitPlugin from './plugins/WaitPlugin';
import LogPlugin from './plugins/LogPlugin';
import {NODE_MAJOR_VERSION, NODE_MINOR_VERSION} from '../constants';

// Forked for Docusaurus: https://github.com/slorber/static-site-generator-webpack-plugin
import StaticSiteGeneratorPlugin from '@slorber/static-site-generator-webpack-plugin';

export default function createServerConfig({
  props,
  onLinksCollected = () => {},
}: {
  props: Props;
  onLinksCollected?: (staticPagePath: string, links: string[]) => void;
}): Configuration {
  const {
    baseUrl,
    routesPaths,
    generatedFilesDir,
    headTags,
    preBodyTags,
    postBodyTags,
    ssrTemplate,
    siteConfig: {noIndex, trailingSlash},
  } = props;
  const config = createBaseConfig(props, true);

  const routesLocation = {};
  // Array of paths to be rendered. Relative to output directory
  const ssgPaths = routesPaths.map((str) => {
    const ssgPath =
      baseUrl === '/' ? str : str.replace(new RegExp(`^${baseUrl}`), '/');
    routesLocation[ssgPath] = str;
    return ssgPath;
  });
  const serverConfig = merge(config, {
    target: `node${NODE_MAJOR_VERSION}.${NODE_MINOR_VERSION}`,
    entry: {
      main: path.resolve(__dirname, '../client/serverEntry.js'),
    },
    output: {
      filename: 'server.bundle.js',
      libraryTarget: 'commonjs2',
      // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
      globalObject: 'this',
    },
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
          ssrTemplate,
          noIndex,
        },
        paths: ssgPaths,
        preferFoldersOutput: trailingSlash,

        // When using "new URL('file.js', import.meta.url)", Webpack will emit __filename, and this plugin will throw
        // not sure the __filename value has any importance for this plugin, just using an empty string to avoid the error
        // See https://github.com/facebook/docusaurus/issues/4922
        globals: {__filename: ''},
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
