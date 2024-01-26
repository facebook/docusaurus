/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import merge from 'webpack-merge';
import {
  NODE_MAJOR_VERSION,
  NODE_MINOR_VERSION,
  DOCUSAURUS_VERSION,
} from '@docusaurus/utils';
// Forked for Docusaurus: https://github.com/slorber/static-site-generator-webpack-plugin
import WebpackBar from 'webpackbar';
import {createBaseConfig} from './base';
import ssrDefaultTemplate from './templates/ssr.html.template';
import type {ServerEntryParams} from '../types';
import type {Props} from '@docusaurus/types';
import type {Configuration} from 'webpack';

type Params = Pick<
  ServerEntryParams,
  'onLinksCollected' | 'onHeadTagsCollected'
> & {
  props: Props;
};

function buildRoutesLocation({
  routesPaths,
  baseUrl,
}: {
  routesPaths: string[];
  baseUrl: string;
}) {
  const routesLocation: {[filePath: string]: string} = {};
  // Array of paths to be rendered. Relative to output directory
  routesPaths.forEach((str) => {
    const ssgPath =
      baseUrl === '/' ? str : str.replace(new RegExp(`^${baseUrl}`), '/');
    routesLocation[ssgPath] = str;
    return ssgPath;
  });
  return routesLocation;
}

export function createServerEntryParams(params: Params): ServerEntryParams {
  const {props, onLinksCollected, onHeadTagsCollected} = params;
  const {
    baseUrl,
    generatedFilesDir,
    headTags,
    preBodyTags,
    postBodyTags,
    outDir,
    siteConfig: {noIndex, ssrTemplate},
  } = props;

  const routesLocation: {[filePath: string]: string} =
    buildRoutesLocation(props);

  const manifestPath = path.join(generatedFilesDir, 'client-manifest.json');

  return {
    outDir,
    baseUrl,
    manifestPath,
    routesLocation,
    headTags,
    preBodyTags,
    postBodyTags,
    onLinksCollected,
    onHeadTagsCollected,
    ssrTemplate: ssrTemplate ?? ssrDefaultTemplate,
    noIndex,
    DOCUSAURUS_VERSION,
  };
}

export default async function createServerConfig(
  params: Params,
): Promise<Configuration> {
  const {props} = params;
  const config = await createBaseConfig(props, true);

  return merge(config, {
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
      // Show compilation progress bar.
      new WebpackBar({
        name: 'Server',
        color: 'yellow',
      }),
    ],
  });
}
