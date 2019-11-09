/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import {normalizeUrl, docuHash, objectWithKeySorted} from '@docusaurus/utils';
import {LoadContext, Plugin} from '@docusaurus/types';

import createOrder from './order';
import loadSidebars from './sidebars';
import processMetadata from './metadata';
import loadEnv from './env';

import {
  PluginOptions,
  Sidebar,
  Order,
  DocsMetadata,
  LoadedContent,
  SourceToPermalink,
  PermalinkToSidebar,
  DocsSidebarItemCategory,
  SidebarItemLink,
  SidebarItemDoc,
  SidebarItemCategory,
  DocsSidebar,
  DocsBaseMetadata,
  MetadataRaw,
} from './types';
import {Configuration} from 'webpack';
import {VERSIONED_DOCS_DIR, VERSIONED_SIDEBARS_DIR} from './constants';

const DEFAULT_OPTIONS: PluginOptions = {
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  include: ['**/*.{md,mdx}'], // Extensions to include.
  sidebarPath: '', // Path to sidebar configuration for showing a list of markdown pages.
  docLayoutComponent: '@theme/DocPage',
  docItemComponent: '@theme/DocItem',
  remarkPlugins: [],
  rehypePlugins: [],
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
};

export default function pluginContentDocs(
  context: LoadContext,
  opts: Partial<PluginOptions>,
): Plugin<LoadedContent | null> {
  const options = {...DEFAULT_OPTIONS, ...opts};
  const {siteDir, generatedFilesDir, baseUrl} = context;
  const docsDir = path.resolve(siteDir, options.path);
  const sourceToPermalink: SourceToPermalink = {};
  const dataDir = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-docs',
  );

  // Versioning
  const env = loadEnv(siteDir);
  const versioningEnabled = env.versioning.enabled;
  const versions = env.versioning.versions ?? [];
  const versionedDir = path.join(siteDir, VERSIONED_DOCS_DIR);
  const versionedSidebarsDir = path.join(siteDir, VERSIONED_SIDEBARS_DIR);

  return {
    name: 'docusaurus-plugin-content-docs',

    getPathsToWatch() {
      const {include = []} = options;
      let globPattern = include.map(pattern => `${docsDir}/${pattern}`);
      if (versioningEnabled) {
        const docsGlob = _.flatten(
          include.map(pattern =>
            versions.map(
              version => `${versionedDir}/version-${version}/${pattern}`,
            ),
          ),
        );
        const sidebarsGlob = versions.map(
          version => `${versionedSidebarsDir}/version-${version}-sidebars.json`,
        );
        globPattern = [...globPattern, ...sidebarsGlob, ...docsGlob];
      }
      return [...globPattern, options.sidebarPath];
    },

    // Fetches blog contents and returns metadata for the contents.
    async loadContent() {
      const {
        include,
        routeBasePath,
        sidebarPath,
        editUrl,
        showLastUpdateAuthor,
        showLastUpdateTime,
      } = options;

      if (!fs.existsSync(docsDir)) {
        return null;
      }

      const loadedSidebars: Sidebar = loadSidebars(sidebarPath);

      // Build the docs ordering such as next, previous, category and sidebar.
      const order: Order = createOrder(loadedSidebars);

      // Prepare metadata container.
      const docsMetadataRaw: {
        [id: string]: MetadataRaw;
      } = {};

      // Metadata for default/ master docs files.
      const docsFiles = await globby(include, {
        cwd: docsDir,
      });
      await Promise.all(
        docsFiles.map(async source => {
          /* TODO: do we need to do this ????
        Do not allow reserved version/ translated folder name in 'docs'
        e.g: 'docs/version-1.0.0/' should not be allowed as it can cause unwanted bug
      */
          const metadata: MetadataRaw = await processMetadata({
            source,
            refDir: docsDir,
            order,
            context,
            docsBasePath: routeBasePath,
            editUrl,
            showLastUpdateAuthor,
            showLastUpdateTime,
          });
          docsMetadataRaw[metadata.id] = metadata;
        }),
      );

      // TODO: Metadata for versioned docs

      // Construct docsMetadata
      const docsMetadata: DocsMetadata = {};
      const permalinkToSidebar: PermalinkToSidebar = {};
      Object.keys(docsMetadataRaw).forEach(currentID => {
        let previous;
        let next;
        const previousID = docsMetadataRaw[currentID].previous;
        if (previousID) {
          previous = {
            title: docsMetadataRaw[previousID]?.title ?? 'Previous',
            permalink: docsMetadataRaw[previousID]?.permalink,
          };
        }
        const nextID = docsMetadataRaw[currentID].next;
        if (nextID) {
          next = {
            title: docsMetadataRaw[nextID]?.title ?? 'Next',
            permalink: docsMetadataRaw[nextID]?.permalink,
          };
        }
        docsMetadata[currentID] = {
          ...docsMetadataRaw[currentID],
          previous,
          next,
        };

        // sourceToPermalink and permalinkToSidebar mapping
        const {source, permalink, sidebar} = docsMetadataRaw[currentID];
        sourceToPermalink[source] = permalink;
        if (sidebar) {
          permalinkToSidebar[permalink] = sidebar;
        }
      });

      const convertDocLink = (item: SidebarItemDoc): SidebarItemLink => {
        const linkID = item.id;
        const linkMetadata = docsMetadataRaw[linkID];

        if (!linkMetadata) {
          throw new Error(
            `Improper sidebars file, document with id '${linkID}' not found.`,
          );
        }

        return {
          type: 'link',
          label: linkMetadata.sidebar_label || linkMetadata.title,
          href: linkMetadata.permalink,
        };
      };

      const normalizeCategory = (
        category: SidebarItemCategory,
      ): DocsSidebarItemCategory => {
        const items = category.items.map(item => {
          switch (item.type) {
            case 'category':
              return normalizeCategory(item as SidebarItemCategory);
            case 'ref':
            case 'doc':
              return convertDocLink(item as SidebarItemDoc);
            case 'link':
            default:
              break;
          }
          return item as SidebarItemLink;
        });
        return {...category, items};
      };

      // Transform the sidebar so that all sidebar item will be in the form of 'link' or 'category' only
      // This is what will be passed as props to the UI component
      const docsSidebars: DocsSidebar = Object.entries(loadedSidebars).reduce(
        (acc: DocsSidebar, [sidebarId, sidebarItemCategories]) => {
          acc[sidebarId] = sidebarItemCategories.map(sidebarItemCategory =>
            normalizeCategory(sidebarItemCategory),
          );
          return acc;
        },
        {},
      );

      return {
        docsMetadata,
        docsDir,
        docsSidebars,
        sourceToPermalink,
        permalinkToSidebar: objectWithKeySorted(permalinkToSidebar),
      };
    },

    async contentLoaded({content, actions}) {
      if (!content || Object.keys(content.docsMetadata).length === 0) {
        return;
      }

      const {docLayoutComponent, docItemComponent, routeBasePath} = options;
      const {addRoute, createData} = actions;
      const aliasedSource = (source: string) =>
        `@docusaurus-plugin-content-docs/${path.relative(dataDir, source)}`;

      const routes = await Promise.all(
        Object.values(content.docsMetadata).map(async metadataItem => {
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
              metadata: aliasedSource(metadataPath),
            },
          };
        }),
      );

      const docsBaseMetadata: DocsBaseMetadata = {
        docsSidebars: content.docsSidebars,
        permalinkToSidebar: content.permalinkToSidebar,
      };

      const docsBaseRoute = normalizeUrl([baseUrl, routeBasePath, ':route']);
      const docsBaseMetadataPath = await createData(
        `${docuHash(docsBaseRoute)}.json`,
        JSON.stringify(docsBaseMetadata, null, 2),
      );

      addRoute({
        path: docsBaseRoute,
        component: docLayoutComponent,
        routes: routes.sort((a, b) =>
          a.path > b.path ? 1 : b.path > a.path ? -1 : 0,
        ),
        modules: {
          docsMetadata: aliasedSource(docsBaseMetadataPath),
        },
      });
    },

    configureWebpack(_, isServer, utils) {
      const {getBabelLoader, getCacheLoader} = utils;
      const {rehypePlugins, remarkPlugins} = options;
      return {
        resolve: {
          alias: {
            '@docusaurus-plugin-content-docs': dataDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [docsDir],
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
                    siteDir,
                    docsDir,
                    sourceToPermalink: sourceToPermalink,
                    versionedDir,
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
