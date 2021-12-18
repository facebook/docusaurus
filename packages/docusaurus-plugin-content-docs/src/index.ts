/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {
  normalizeUrl,
  docuHash,
  aliasedSitePath,
  reportMessage,
  posixPath,
  addTrailingPathSeparator,
  createAbsoluteFilePathMatcher,
  createSlugger,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/utils';
import type {LoadContext, Plugin} from '@docusaurus/types';
import {loadSidebars} from './sidebars';
import {CategoryMetadataFilenamePattern} from './sidebars/generator';
import {
  readVersionDocs,
  processDocMetadata,
  addDocNavigation,
  getMainDocId,
} from './docs';
import {getDocsDirPaths, readVersionsMetadata} from './versions';

import {
  PluginOptions,
  LoadedContent,
  SourceToPermalink,
  DocMetadataBase,
  GlobalPluginData,
  VersionMetadata,
  LoadedVersion,
  DocFile,
  DocsMarkdownOption,
  VersionTag,
} from './types';
import type {RuleSetRule} from 'webpack';
import {cliDocsVersionCommand} from './cli';
import {VERSIONS_JSON_FILE} from './constants';
import {keyBy, mapValues} from 'lodash';
import {toGlobalDataVersion} from './globalData';
import {toTagDocListProp} from './props';
import {
  translateLoadedContent,
  getLoadedContentTranslationFiles,
} from './translations';
import chalk from 'chalk';
import {getVersionTags} from './tags';
import {createVersionRoutes} from './routes';
import type {PropTagsListPage} from '@docusaurus/plugin-content-docs';
import {createSidebarsUtils} from './sidebars/utils';
import {getCategoryGeneratedIndexMetadataList} from './categoryGeneratedIndex';

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
        const docs: DocMetadataBase[] = await loadVersionDocsBase(
          versionMetadata,
        );

        const sidebars = await loadSidebars(versionMetadata.sidebarFilePath, {
          sidebarItemsGenerator: options.sidebarItemsGenerator,
          numberPrefixParser: options.numberPrefixParser,
          docs,
          version: versionMetadata,
          sidebarOptions: {
            sidebarCollapsed: options.sidebarCollapsed,
            sidebarCollapsible: options.sidebarCollapsible,
          },
          categoryLabelSlugger: createSlugger(),
        });

        const sidebarsUtils = createSidebarsUtils(sidebars);

        return {
          ...versionMetadata,
          docs: addDocNavigation(
            docs,
            sidebarsUtils,
            versionMetadata.sidebarFilePath as string,
          ),
          sidebars,
          mainDocId: getMainDocId({docs, sidebarsUtils}),
          categoryGeneratedIndices: getCategoryGeneratedIndexMetadataList({
            docs,
            sidebarsUtils,
          }),
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
      const {
        docLayoutComponent,
        docItemComponent,
        docCategoryGeneratedIndexComponent,
      } = options;
      const {addRoute, createData, setGlobalData} = actions;

      async function createVersionTagsRoutes(version: LoadedVersion) {
        const versionTags = getVersionTags(version.docs);

        // TODO tags should be a sub route of the version route
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
              `${docuHash(`tags-list-${version.versionName}-prop`)}.json`,
              JSON.stringify(tagsProp, null, 2),
            );
            addRoute({
              path: version.tagsPath,
              exact: true,
              component: options.docTagsListComponent,
              modules: {
                tags: aliasedSource(tagsPropPath),
              },
            });
          }
        }

        // TODO tags should be a sub route of the version route
        async function createTagDocListPage(tag: VersionTag) {
          const tagProps = toTagDocListProp({
            allTagsPath: version.tagsPath,
            tag,
            docs: version.docs,
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

      await Promise.all(
        loadedVersions.map((loadedVersion) =>
          createVersionRoutes({
            loadedVersion,
            docItemComponent,
            docLayoutComponent,
            docCategoryGeneratedIndexComponent,
            pluginId,
            aliasedSource,
            actions,
          }),
        ),
      );

      // TODO tags should be a sub route of the version route
      await Promise.all(loadedVersions.map(createVersionTagsRoutes));

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
                staticDirs: siteConfig.staticDirectories.map((dir) =>
                  path.resolve(siteDir, dir),
                ),
                siteDir,
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
