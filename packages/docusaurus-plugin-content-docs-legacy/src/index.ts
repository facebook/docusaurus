/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import {idx, normalizeUrl, docuHash} from '@docusaurus/utils';

import createOrder from './order';
import loadSidebars from './sidebars';
import processMetadata from './metadata';
import {LoadContext, Plugin, DocusaurusConfig} from '@docusaurus/types';
import {
  PluginOptions,
  Sidebar,
  Order,
  Metadata,
  DocsMetadata,
  LoadedContent,
  SourceToPermalink,
  PermalinkToId,
} from './types';
import {Configuration} from 'webpack';

const DEFAULT_OPTIONS: PluginOptions = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  include: ['**/*.md', '**/*.mdx'], // Extensions to include.
  sidebarPath: '', // Path to sidebar configuration for showing a list of markdown pages.
  docLayoutComponent: '@theme/DocLegacyPage',
  docItemComponent: '@theme/DocLegacyItem',
  remarkPlugins: [],
  rehypePlugins: [],
};

export default function pluginContentDocs(
  context: LoadContext,
  opts: Partial<PluginOptions>,
): Plugin<LoadedContent | null> {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const contentPath = path.resolve(context.siteDir, options.path);
  let sourceToPermalink: SourceToPermalink = {};

  return {
    name: 'docusaurus-plugin-content-docs',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
      return [...globPattern, options.sidebarPath];
    },

    // Fetches blog contents and returns metadata for the contents.
    async loadContent() {
      const {include, routeBasePath, sidebarPath} = options;
      const {siteConfig, siteDir} = context;
      const docsDir = contentPath;

      if (!fs.existsSync(docsDir)) {
        return null;
      }

      const docsSidebars: Sidebar = loadSidebars(sidebarPath);

      // Build the docs ordering such as next, previous, category and sidebar
      const order: Order = createOrder(docsSidebars);

      // Prepare metadata container.
      const docs: DocsMetadata = {};

      // Metadata for default docs files.
      const docsFiles = await globby(include, {
        cwd: docsDir,
      });
      await Promise.all(
        docsFiles.map(async source => {
          const metadata: Metadata = await processMetadata(
            source,
            docsDir,
            order,
            siteConfig,
            routeBasePath,
            siteDir,
          );
          docs[metadata.id] = metadata;
        }),
      );

      // Get the titles of the previous and next ids so that we can use them.
      Object.keys(docs).forEach(currentID => {
        const previousID = idx(docs, [currentID, 'previous']);
        if (previousID) {
          const previousTitle = idx(docs, [previousID, 'title']);
          docs[currentID].previous_title = previousTitle || 'Previous';
        }
        const nextID = idx(docs, [currentID, 'next']);
        if (nextID) {
          const nextTitle = idx(docs, [nextID, 'title']);
          docs[currentID].next_title = nextTitle || 'Next';
        }
      });

      const permalinkToId: PermalinkToId = {};
      Object.values(docs).forEach(({id, source, permalink}) => {
        sourceToPermalink[source] = permalink;
        permalinkToId[permalink] = id;
      });

      return {
        docs,
        docsDir,
        docsSidebars,
        sourceToPermalink,
        permalinkToId,
      };
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {docLayoutComponent, docItemComponent, routeBasePath} = options;
      const {addRoute, createData} = actions;

      const routes = await Promise.all(
        Object.values(content.docs).map(async metadataItem => {
          const metadataPath = await createData(
            `${docuHash(metadataItem.permalink)}.json`,
            JSON.stringify(metadataItem, null, 2),
          );
          return {
            path: metadataItem.permalink,
            component: docItemComponent,
            exact: true,
            modules: {
              content: metadataItem.source,
              metadata: metadataPath,
            },
          };
        }),
      );

      const docsBaseRoute = normalizeUrl([
        (context.siteConfig as DocusaurusConfig).baseUrl,
        routeBasePath,
      ]);
      const docsMetadataPath = await createData(
        `${docuHash(docsBaseRoute)}.json`,
        JSON.stringify(content, null, 2),
      );

      addRoute({
        path: docsBaseRoute,
        component: docLayoutComponent,
        routes,
        modules: {
          docsMetadata: docsMetadataPath,
        },
      });
    },

    configureWebpack(_, isServer, utils) {
      const {getBabelLoader, getCacheLoader} = utils;
      const {rehypePlugins, remarkPlugins} = options;
      return {
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [contentPath],
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: '@docusaurus/mdx-loader',
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdown/index.js'),
                  options: {
                    siteConfig: context.siteConfig,
                    siteDir: context.siteDir,
                    docsDir: contentPath,
                    sourceToPermalink: sourceToPermalink,
                  },
                },
              ].filter(Boolean),
            },
          ],
        },
      } as Configuration;
    },
  };
}
