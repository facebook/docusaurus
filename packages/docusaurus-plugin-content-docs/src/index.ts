/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {
  STATIC_DIR_NAME,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/core/lib/constants';
import {normalizeUrl, docuHash, aliasedSitePath} from '@docusaurus/utils';
import {LoadContext, Plugin, RouteConfig} from '@docusaurus/types';

import {createOrder} from './order';
import {loadSidebars} from './sidebars';
import {readVersionDocs, processDocMetadata} from './docs';
import {readVersionsMetadata, getVersionedDocsDirPath} from './env';

import {
  PluginOptions,
  Order,
  LoadedContent,
  SourceToPermalink,
  PermalinkToSidebar,
  DocMetadataBase,
  DocsMetadataRaw,
  DocMetadata,
  GlobalPluginData,
  VersionMetadata,
  DocNavLink,
  LoadedVersion,
  DocFile,
} from './types';
import {RuleSetRule} from 'webpack';
import {cliDocsVersion} from './cli';
import {VERSIONS_JSON_FILE} from './constants';
import {OptionsSchema} from './options';
import {flatten, keyBy, compact} from 'lodash';
import {toGlobalDataVersion} from './globalData';
import {toVersionMetadataProp} from './versionMetadataProp';

export default function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent, typeof OptionsSchema> {
  const {siteDir, generatedFilesDir, baseUrl} = context;

  const versionsMetadata = readVersionsMetadata({context, options});

  const docsDir = path.resolve(siteDir, options.path);

  const sourceToPermalink: SourceToPermalink = {};
  const pluginId = options.id ?? DEFAULT_PLUGIN_ID;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-docs',
  );
  const dataDir = path.join(pluginDataDirRoot, pluginId);
  const aliasedSource = (source: string) =>
    `~docs/${path.relative(pluginDataDirRoot, source)}`;

  return {
    name: 'docusaurus-plugin-content-docs',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },

    extendCli(cli) {
      const isDefaultPluginId = pluginId === DEFAULT_PLUGIN_ID;

      // Need to create one distinct command per plugin instance
      // otherwise 2 instances would try to execute the command!
      const command = isDefaultPluginId
        ? 'docs:version'
        : `docs:version:${pluginId}`;
      const commandDescription = isDefaultPluginId
        ? 'Tag a new docs version'
        : `Tag a new docs version (${pluginId})`;

      cli
        .command(command)
        .arguments('<version>')
        .description(commandDescription)
        .action((version) => {
          cliDocsVersion(version, siteDir, pluginId, {
            path: options.path,
            sidebarPath: options.sidebarPath,
          });
        });
    },

    getClientModules() {
      const modules = [];
      if (options.admonitions) {
        modules.push(require.resolve('remark-admonitions/styles/infima.css'));
      }
      return modules;
    },

    getPathsToWatch() {
      function getVersionPathsToWatch(version: VersionMetadata): string[] {
        return [
          version.sidebarFilePath,
          ...options.include.map(
            (pattern) => `${version.docsDirPath}/${pattern}`,
          ),
        ];
      }

      return flatten(versionsMetadata.map(getVersionPathsToWatch));
    },

    async loadContent() {
      async function loadVersionDocs(
        versionMetadata: VersionMetadata,
      ): Promise<DocMetadataBase[]> {
        const docFiles = await readVersionDocs(versionMetadata, options);
        async function processVersionDoc(docFile: DocFile) {
          return processDocMetadata({
            docFile,
            versionMetadata,
            context,
            options,
          });
        }
        return Promise.all(docFiles.map(processVersionDoc));
      }

      async function loadVersion(
        versionMetadata: VersionMetadata,
      ): Promise<LoadedVersion> {
        const docs: DocMetadataBase[] = await loadVersionDocs(versionMetadata);
        const docsById: DocsMetadataRaw = keyBy(docs, (doc) => doc.id);

        const sidebars = loadSidebars([versionMetadata.sidebarFilePath]);
        const docsOrder: Order = createOrder(sidebars);

        // Add sidebar/next/previous to the docs
        function addNavData(doc: DocMetadataBase): DocMetadata {
          const {next: nextId, previous: previousId, sidebar} =
            docsOrder[doc.id] ?? {};
          const toDocNavLink = (navDocId: string): DocNavLink => ({
            title: docsById[navDocId].title,
            permalink: docsById[navDocId].permalink,
          });
          return {
            ...doc,
            sidebar,
            previous: previousId ? toDocNavLink(previousId) : undefined,
            next: nextId ? toDocNavLink(nextId) : undefined,
          };
        }

        const loadedDocs = docs.map(addNavData);

        // sort to ensure consistent output for tests
        loadedDocs.sort((a, b) => a.id.localeCompare(b.id));

        // TODO annoying side effect!
        Object.values(loadedDocs).forEach((loadedDoc) => {
          const {source, permalink} = loadedDoc;
          sourceToPermalink[source] = permalink;
        });

        // TODO replace with global state logic?
        const permalinkToSidebar: PermalinkToSidebar = {};
        Object.values(loadedDocs).forEach((loadedDoc) => {
          const {id: docId, permalink} = loadedDoc;
          const docSidebarName = docsOrder[docId]?.sidebar;
          if (docSidebarName) {
            permalinkToSidebar[permalink] = docSidebarName;
          }
        });

        // TODO bad legacy algo! docs[0] gives a random doc
        // We should fallback to the first doc of the first sidebar instead
        const mainDoc: DocMetadata =
          docs.find(
            (doc) =>
              doc.unversionedId === options.homePageId || doc.slug === '/',
          ) ?? docs[0];

        return {
          ...versionMetadata,
          mainDocId: mainDoc.unversionedId,
          sidebars,
          permalinkToSidebar,
          docs: docs.map(addNavData),
        };
      }

      return {
        loadedVersions: await Promise.all(versionsMetadata.map(loadVersion)),
      };
    },

    async contentLoaded({content, actions}) {
      const {loadedVersions} = content;
      const {docLayoutComponent, docItemComponent} = options;
      const {addRoute, createData, setGlobalData} = actions;

      const createDocRoutes = async (
        docs: DocMetadata[],
      ): Promise<RouteConfig[]> => {
        const routes = await Promise.all(
          docs.map(async (metadataItem) => {
            await createData(
              // Note that this created data path must be in sync with
              // metadataPath provided to mdx-loader.
              `${docuHash(metadataItem.source)}.json`,
              JSON.stringify(metadataItem, null, 2),
            );

            return {
              path: metadataItem.permalink,
              component: docItemComponent,
              exact: true,
              modules: {
                content: metadataItem.source,
              },
            };
          }),
        );

        return routes.sort((a, b) => a.path.localeCompare(b.path));
      };

      async function handleVersion(loadedVersion: LoadedVersion) {
        const versionMetadataPropPath = await createData(
          `${docuHash(
            `version-${loadedVersion.versionName}-metadata-prop`,
          )}.json`,
          JSON.stringify(toVersionMetadataProp(loadedVersion), null, 2),
        );

        addRoute({
          path: loadedVersion.versionPath,
          // allow matching /docs/* as well
          exact: false,
          // main docs component (DocPage)
          component: docLayoutComponent,
          // sub-routes for each doc
          routes: await createDocRoutes(loadedVersion.docs),
          modules: {
            versionMetadata: aliasedSource(versionMetadataPropPath),
          },
          priority: loadedVersion.routePriority,
        });
      }

      await Promise.all(loadedVersions.map(handleVersion));

      setGlobalData<GlobalPluginData>({
        path: normalizeUrl([baseUrl, options.routeBasePath]),
        versions: loadedVersions.map(toGlobalDataVersion),
      });
    },

    configureWebpack(_config, isServer, utils) {
      const {getBabelLoader, getCacheLoader} = utils;
      const {rehypePlugins, remarkPlugins} = options;

      // TODO instead of creating one mdx loader rule for all versions
      // it may be simpler to create one mdx loader per version
      // particularly to handle the markdown/linkify process
      // (docsDir/versionedDir are a bit annoying here...)
      function createMDXLoaderRule(): RuleSetRule {
        return {
          test: /(\.mdx?)$/,
          include: versionsMetadata.map((vmd) => vmd.docsDirPath),
          use: compact([
            getCacheLoader(isServer),
            getBabelLoader(isServer),
            {
              loader: require.resolve('@docusaurus/mdx-loader'),
              options: {
                remarkPlugins,
                rehypePlugins,
                staticDir: path.join(siteDir, STATIC_DIR_NAME),
                metadataPath: (mdxPath: string) => {
                  // Note that metadataPath must be the same/in-sync as
                  // the path from createData for each MDX.
                  const aliasedPath = aliasedSitePath(mdxPath, siteDir);
                  return path.join(dataDir, `${docuHash(aliasedPath)}.json`);
                },
              },
            },
            {
              loader: path.resolve(__dirname, './markdown/index.js'),
              options: {
                siteDir,

                // TODO legacy attributes, need refactor
                docsDir,
                sourceToPermalink,
                versionedDir: getVersionedDocsDirPath(siteDir, options.id),
              },
            },
          ]),
        };
      }

      // Suppress warnings about non-existing of versions file.
      const stats = {
        warningsFilter: [VERSIONS_JSON_FILE],
      };

      return {
        stats,
        devServer: {
          stats,
        },
        resolve: {
          alias: {
            '~docs': pluginDataDirRoot,
          },
        },
        module: {
          rules: [createMDXLoaderRule()],
        },
      };
    },
  };
}

export {validateOptions} from './options';
