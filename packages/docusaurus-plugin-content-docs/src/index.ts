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
  createAbsoluteFilePathMatcher,
} from '@docusaurus/utils';
import {LoadContext, Plugin, RouteConfig} from '@docusaurus/types';
import {loadSidebars} from './sidebars';
import {CategoryMetadataFilenamePattern} from './sidebars/generator';
import {readVersionDocs, processDocMetadata, handleNavigation} from './docs';
import {getDocsDirPaths, readVersionsMetadata} from './versions';

import {
  PluginOptions,
  LoadedContent,
  SourceToPermalink,
  DocMetadataBase,
  DocMetadata,
  GlobalPluginData,
  VersionMetadata,
  LoadedVersion,
  DocFile,
  DocsMarkdownOption,
  VersionTag,
} from './types';
import {RuleSetRule} from 'webpack';
import {cliDocsVersionCommand} from './cli';
import {VERSIONS_JSON_FILE} from './constants';
import {keyBy, mapValues} from 'lodash';
import {toGlobalDataVersion} from './globalData';
import {toTagDocListProp, toVersionMetadataProp} from './props';
import {
  translateLoadedContent,
  getLoadedContentTranslationFiles,
} from './translations';
import chalk from 'chalk';
import {getVersionTags} from './tags';
import {PropTagsListPage} from '@docusaurus/plugin-content-docs-types';

export default function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent> {
  const {siteDir, generatedFilesDir, baseUrl, siteConfig} = context;

  const versionsMetadata = readVersionsMetadata({context, options});

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
            sidebarCollapsed: options.sidebarCollapsed,
            sidebarCollapsible: options.sidebarCollapsible,
          });
        });
    },

    async getTranslationFiles({content}) {
      return getLoadedContentTranslationFiles(content);
    },

    getPathsToWatch() {
      function getVersionPathsToWatch(version: VersionMetadata): string[] {
        const result = [
          ...options.include.flatMap((pattern) =>
            getDocsDirPaths(version).map(
              (docsDirPath) => `${docsDirPath}/${pattern}`,
            ),
          ),
          `${version.contentPath}/**/${CategoryMetadataFilenamePattern}`,
        ];
        if (typeof version.sidebarFilePath === 'string') {
          result.unshift(version.sidebarFilePath);
        }
        return result;
      }

      return versionsMetadata.flatMap(getVersionPathsToWatch);
    },

    async loadContent() {
      async function loadVersionDocsBase(
        versionMetadata: VersionMetadata,
      ): Promise<DocMetadataBase[]> {
        const docFiles = await readVersionDocs(versionMetadata, options);
        if (docFiles.length === 0) {
          throw new Error(
            `Docs version "${
              versionMetadata.versionName
            }" has no docs! At least one doc should exist at "${path.relative(
              siteDir,
              versionMetadata.contentPath,
            )}".`,
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

      async function doLoadVersion(
        versionMetadata: VersionMetadata,
      ): Promise<LoadedVersion> {
        const docsBase: DocMetadataBase[] = await loadVersionDocsBase(
          versionMetadata,
        );

        const sidebars = await loadSidebars(versionMetadata.sidebarFilePath, {
          sidebarItemsGenerator: options.sidebarItemsGenerator,
          numberPrefixParser: options.numberPrefixParser,
          docs: docsBase,
          version: versionMetadata,
          options: {
            sidebarCollapsed: options.sidebarCollapsed,
            sidebarCollapsible: options.sidebarCollapsible,
          },
        });
        return {
          ...versionMetadata,
          ...handleNavigation(
            docsBase,
            sidebars,
            versionMetadata.sidebarFilePath as string,
          ),
          sidebars,
        };
      }

      async function loadVersion(versionMetadata: VersionMetadata) {
        try {
          return await doLoadVersion(versionMetadata);
        } catch (e) {
          console.error(
            chalk.red(
              `Loading of version failed for version "${versionMetadata.versionName}"`,
            ),
          );
          throw e;
        }
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

            const docRoute: RouteConfig = {
              path: metadataItem.permalink,
              component: docItemComponent,
              exact: true,
              modules: {
                content: metadataItem.source,
              },
              // Because the parent (DocPage) comp need to access it easily
              // This permits to render the sidebar once without unmount/remount when navigating (and preserve sidebar state)
              ...(metadataItem.sidebar && {
                sidebar: metadataItem.sidebar,
              }),
            };

            return docRoute;
          }),
        );

        return routes.sort((a, b) => a.path.localeCompare(b.path));
      };

      async function createVersionTagsRoutes(loadedVersion: LoadedVersion) {
        const versionTags = getVersionTags(loadedVersion.docs);

        async function createTagsListPage() {
          const tagsProp: PropTagsListPage['tags'] = Object.values(
            versionTags,
          ).map((tagValue) => ({
            name: tagValue.name,
            permalink: tagValue.permalink,
            count: tagValue.docIds.length,
          }));

          // Only create /tags page if there are tags.
          if (Object.keys(tagsProp).length > 0) {
            const tagsPropPath = await createData(
              `${docuHash(`tags-list-${loadedVersion.versionName}-prop`)}.json`,
              JSON.stringify(tagsProp, null, 2),
            );
            addRoute({
              path: loadedVersion.tagsPath,
              exact: true,
              component: options.docTagsListComponent,
              modules: {
                tags: aliasedSource(tagsPropPath),
              },
            });
          }
        }

        async function createTagDocListPage(tag: VersionTag) {
          const tagProps = toTagDocListProp({
            allTagsPath: loadedVersion.tagsPath,
            tag,
            docs: loadedVersion.docs,
          });
          const tagPropPath = await createData(
            `${docuHash(`tag-${tag.permalink}`)}.json`,
            JSON.stringify(tagProps, null, 2),
          );
          addRoute({
            path: tag.permalink,
            component: options.docTagDocListComponent,
            exact: true,
            modules: {
              tag: aliasedSource(tagPropPath),
            },
          });
        }

        await createTagsListPage();
        await Promise.all(Object.values(versionTags).map(createTagDocListPage));
      }

      async function doCreateVersionRoutes(
        loadedVersion: LoadedVersion,
      ): Promise<void> {
        await createVersionTagsRoutes(loadedVersion);

        const versionMetadata = toVersionMetadataProp(pluginId, loadedVersion);
        const versionMetadataPropPath = await createData(
          `${docuHash(
            `version-${loadedVersion.versionName}-metadata-prop`,
          )}.json`,
          JSON.stringify(versionMetadata, null, 2),
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

      async function createVersionRoutes(
        loadedVersion: LoadedVersion,
      ): Promise<void> {
        try {
          return await doCreateVersionRoutes(loadedVersion);
        } catch (e) {
          console.error(
            chalk.red(
              `Can't create version routes for version "${loadedVersion.versionName}"`,
            ),
          );
          throw e;
        }
      }

      await Promise.all(loadedVersions.map(createVersionRoutes));

      setGlobalData<GlobalPluginData>({
        path: normalizeUrl([baseUrl, options.routeBasePath]),
        versions: loadedVersions.map(toGlobalDataVersion),
      });
    },

    configureWebpack(_config, isServer, utils, content) {
      const {getJSLoader} = utils;
      const {
        rehypePlugins,
        remarkPlugins,
        beforeDefaultRehypePlugins,
        beforeDefaultRemarkPlugins,
      } = options;

      function getSourceToPermalink(): SourceToPermalink {
        const allDocs = content.loadedVersions.flatMap((v) => v.docs);
        return mapValues(
          keyBy(allDocs, (d) => d.source),
          (d) => d.permalink,
        );
      }

      const docsMarkdownOptions: DocsMarkdownOption = {
        siteDir,
        sourceToPermalink: getSourceToPermalink(),
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
        const contentDirs = versionsMetadata.flatMap(getDocsDirPaths);
        return {
          test: /(\.mdx?)$/,
          include: contentDirs
            // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
            .map(addTrailingPathSeparator),
          use: [
            getJSLoader({isServer}),
            {
              loader: require.resolve('@docusaurus/mdx-loader'),
              options: {
                remarkPlugins,
                rehypePlugins,
                beforeDefaultRehypePlugins,
                beforeDefaultRemarkPlugins,
                staticDir: path.join(siteDir, STATIC_DIR_NAME),
                isMDXPartial: createAbsoluteFilePathMatcher(
                  options.exclude,
                  contentDirs,
                ),
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
          ].filter(Boolean),
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
