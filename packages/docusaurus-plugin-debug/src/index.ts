/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {docuHash, normalizeUrl, posixPath} from '@docusaurus/utils';
import type {LoadContext, Plugin} from '@docusaurus/types';

export default function pluginDebug({
  siteConfig: {baseUrl},
  generatedFilesDir,
}: LoadContext): Plugin<undefined> {
  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-debug',
  );
  const aliasedSource = (source: string) =>
    `~debug/${posixPath(path.relative(pluginDataDirRoot, source))}`;

  return {
    name: 'docusaurus-plugin-debug',

    getThemePath() {
      return '../lib/theme';
    },
    getTypeScriptThemePath() {
      return '../src/theme';
    },

    async contentLoaded({actions: {createData, addRoute}, allContent}) {
      const allContentPath = await createData(
        // Note that this created data path must be in sync with
        // metadataPath provided to mdx-loader.
        `${docuHash('docusaurus-debug-allContent')}.json`,
        JSON.stringify(allContent, null, 2),
      );

      // Home is config (duplicate for now)
      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug']),
        component: '@theme/DebugConfig',
        exact: true,
      });

      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug/config']),
        component: '@theme/DebugConfig',
        exact: true,
      });

      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug/metadata']),
        component: '@theme/DebugSiteMetadata',
        exact: true,
      });

      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug/registry']),
        component: '@theme/DebugRegistry',
        exact: true,
      });

      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug/routes']),
        component: '@theme/DebugRoutes',
        exact: true,
      });

      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug/content']),
        component: '@theme/DebugContent',
        exact: true,
        modules: {
          allContent: aliasedSource(allContentPath),
        },
      });

      addRoute({
        path: normalizeUrl([baseUrl, '__docusaurus/debug/globalData']),
        component: '@theme/DebugGlobalData',
        exact: true,
      });
    },

    configureWebpack() {
      return {
        resolve: {
          alias: {
            '~debug': pluginDataDirRoot,
          },
        },
      };
    },
  };
}
