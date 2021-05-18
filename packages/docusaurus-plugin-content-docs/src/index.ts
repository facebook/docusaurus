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
import {
  normalizeUrl,
  docuHash,
  aliasedSitePath,
  reportMessage,
  posixPath,
  addTrailingPathSeparator,
} from '@docusaurus/utils';
import {LoadContext, Plugin, RouteConfig} from '@docusaurus/types';
import {loadSidebars, createSidebarsUtils, processSidebars} from './sidebars';
import {readVersionDocs, processDocMetadata} from './docs';
import {getDocsDirPaths, readVersionsMetadata} from './versions';

import {
  PluginOptions,
  LoadedContent,
  SourceToPermalink,
  DocMetadataBase,
  DocMetadata,
  GlobalPluginData,
  VersionMetadata,
  DocNavLink,
  LoadedVersion,
  DocFile,
  DocsMarkdownOption,
} from './types';
import {PermalinkToSidebar} from '@docusaurus/plugin-content-docs-types';
import {RuleSetRule} from 'webpack';
import {cliDocsVersionCommand} from './cli';
import {VERSIONS_JSON_FILE} from './constants';
import {flatten, keyBy, compact} from 'lodash';
import {toGlobalDataVersion} from './globalData';
import {toVersionMetadataProp} from './props';
import {
  translateLoadedContent,
  getLoadedContentTranslationFiles,
} from './translations';
import {CategoryMetadataFilenamePattern} from './sidebarItemsGenerator';

export default function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent> {
  const {siteDir, generatedFilesDir, baseUrl, siteConfig} = context;

  const versionsMetadata = readVersionsMetadata({context, options});

  const sourceToPermalink: SourceToPermalink = {};
  const pluginId = options.id ?? DEFAULT_PLUGIN_ID;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-docs',
  );
  const dataDir = path.join(pluginDataDirRoot, pluginId);
  const aliasedSource = (source: string) =>
    `~docs/${posixPath(path.relative(pluginDataDirRoot, source))}`;

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
          cliDocsVersionCommand(version, siteDir, pluginId, {
            path: options.path,
            sidebarPath: options.sidebarPath,
          });
        });
    },

    async getTranslationFiles({content}) {
      return getLoadedContentTranslationFiles(content);
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
        const result = [
          ...flatten(
            options.include.map((pattern) =>
              getDocsDirPaths(version).map(
                (docsDirPath) => `${docsDirPath}/${pattern}`,
              ),
            ),
          ),
          `${version.contentPath}/**/${CategoryMetadataFilenamePattern}`,
        ];
        if (typeof version.sidebarFilePath === 'string') {
          result.unshift(version.sidebarFilePath);
        }
        return result;
      }

      return flatten(versionsMetadata.map(getVersionPathsToWatch));
    },

    async loadContent() {
      async function loadVersionDocsBase(
        versionMetadata: VersionMetadata,
      ): Promise<DocMetadataBase[]> {
        const docFiles = await readVersionDocs(versionMetadata, options);
        if (docFiles.length === 0) {
          throw new Error(
            `Docs version ${
              versionMetadata.versionName
            } has no docs! At least one doc should exist at path=[${path.relative(
              siteDir,
              versionMetadata.contentPath,
            )}]`,
          );
        }
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
        const unprocessedSidebars = loadSidebars(
          versionMetadata.sidebarFilePath,
        );

        const docsBase: DocMetadataBase[] = await loadVersionDocsBase(
          versionMetadata,
        );
        const docsBaseById: Record<string, DocMetadataBase> = keyBy(
          docsBase,
          (doc) => doc.id,
        );

        const sidebars = await processSidebars({
          sidebarItemsGenerator: options.sidebarItemsGenerator,
          numberPrefixParser: options.numberPrefixParser,
          unprocessedSidebars,
          docs: docsBase,
          version: versionMetadata,
        });

        const sidebarsUtils = createSidebarsUtils(sidebars);

        const validDocIds = Object.keys(docsBaseById);
        sidebarsUtils.checkSidebarsDocIds(validDocIds);

        // Add sidebar/next/previous to the docs
        function addNavData(doc: DocMetadataBase): DocMetadata {
          const {
            sidebarName,
            previousId,
            nextId,
          } = sidebarsUtils.getDocNavigation(doc.id);
          const toDocNavLink = (navDocId: string): DocNavLink => ({
            title: docsBaseById[navDocId].title,
            permalink: docsBaseById[navDocId].permalink,
          });
          return {
            ...doc,
            sidebar: sidebarName,
            previous: previousId ? toDocNavLink(previousId) : undefined,
            next: nextId ? toDocNavLink(nextId) : undefined,
          };
        }

        const docs = docsBase.map(addNavData);

        // sort to ensure consistent output for tests
        docs.sort((a, b) => a.id.localeCompare(b.id));

        // TODO annoying side effect!
        Object.values(docs).forEach((loadedDoc) => {
          const {source, permalink} = loadedDoc;
          sourceToPermalink[source] = permalink;
        });

        // TODO really useful? replace with global state logic?
        const permalinkToSidebar: PermalinkToSidebar = {};
        Object.values(docs).forEach((doc) => {
          if (doc.sidebar) {
            permalinkToSidebar[doc.permalink] = doc.sidebar;
          }
        });

        // The "main doc" is the "version entry point"
        // We browse this doc by clicking on a version:
        // - the "home" doc (at '/docs/')
        // - the first doc of the first sidebar
        // - a random doc (if no docs are in any sidebar... edge case)
        function getMainDoc(): DocMetadata {
          const versionHomeDoc = docs.find(
            (doc) =>
              doc.unversionedId === options.homePageId || doc.slug === '/',
          );
          const firstDocIdOfFirstSidebar = sidebarsUtils.getFirstDocIdOfFirstSidebar();
          if (versionHomeDoc) {
            return versionHomeDoc;
          } else if (firstDocIdOfFirstSidebar) {
            return docs.find((doc) => doc.id === firstDocIdOfFirstSidebar)!;
          } else {
            return docs[0];
          }
        }

        return {
          ...versionMetadata,
          mainDocId: getMainDoc().unversionedId,
          sidebars,
          permalinkToSidebar,
          docs: docs.map(addNavData),
        };
      }

      return {
        loadedVersions: await Promise.all(versionsMetadata.map(loadVersion)),
      };
    },

    translateContent({content, translationFiles}) {
      return translateLoadedContent(content, translationFiles);
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
          JSON.stringify(
            toVersionMetadataProp(pluginId, loadedVersion),
            null,
            2,
          ),
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
      const {getJSLoader} = utils;
      const {
        rehypePlugins,
        remarkPlugins,
        beforeDefaultRehypePlugins,
        beforeDefaultRemarkPlugins,
      } = options;

      const docsMarkdownOptions: DocsMarkdownOption = {
        siteDir,
        sourceToPermalink,
        versionsMetadata,
        onBrokenMarkdownLink: (brokenMarkdownLink) => {
          if (siteConfig.onBrokenMarkdownLinks === 'ignore') {
            return;
          }
          reportMessage(
            `Docs markdown link couldn't be resolved: (${brokenMarkdownLink.link}) in ${brokenMarkdownLink.filePath} for version ${brokenMarkdownLink.contentPaths.versionName}`,
            siteConfig.onBrokenMarkdownLinks,
          );
        },
      };

      function createMDXLoaderRule(): RuleSetRule {
        return {
          test: /(\.mdx?)$/,
          include: flatten(versionsMetadata.map(getDocsDirPaths))
            // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
            .map(addTrailingPathSeparator),
          use: compact([
            getJSLoader({isServer}),
            {
              loader: require.resolve('@docusaurus/mdx-loader'),
              options: {
                remarkPlugins,
                rehypePlugins,
                beforeDefaultRehypePlugins,
                beforeDefaultRemarkPlugins,
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
              options: docsMarkdownOptions,
            },
          ]),
        };
      }

      return {
        ignoreWarnings: [
          // Suppress warnings about non-existing of versions file.
          (e) =>
            e.message.includes("Can't resolve") &&
            e.message.includes(VERSIONS_JSON_FILE),
        ],
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
