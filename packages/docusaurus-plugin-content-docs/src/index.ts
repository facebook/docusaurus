/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {
  normalizeUrl,
  docuHash,
  aliasedSitePath,
  getContentPathList,
  posixPath,
  addTrailingPathSeparator,
  createAbsoluteFilePathMatcher,
  createSlugger,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/utils';
import {loadSidebars, resolveSidebarPathOption} from './sidebars';
import {CategoryMetadataFilenamePattern} from './sidebars/generator';
import {
  readVersionDocs,
  processDocMetadata,
  addDocNavigation,
  type DocEnv,
  createDocsByIdIndex,
} from './docs';
import {readVersionsMetadata, toFullVersion} from './versions';
import {cliDocsVersionCommand} from './cli';
import {VERSIONS_JSON_FILE} from './constants';
import {toGlobalDataVersion} from './globalData';
import {
  translateLoadedContent,
  getLoadedContentTranslationFiles,
} from './translations';
import {createAllRoutes} from './routes';
import {createSidebarsUtils} from './sidebars/utils';

import type {
  PluginOptions,
  DocMetadataBase,
  VersionMetadata,
  DocFrontMatter,
  LoadedContent,
  LoadedVersion,
} from '@docusaurus/plugin-content-docs';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {
  SourceToPermalink,
  DocFile,
  DocsMarkdownOption,
  FullVersion,
} from './types';
import type {RuleSetRule} from 'webpack';

export default async function pluginContentDocs(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin<LoadedContent>> {
  const {siteDir, generatedFilesDir, baseUrl, siteConfig} = context;
  // Mutate options to resolve sidebar path according to siteDir
  options.sidebarPath = resolveSidebarPathOption(siteDir, options.sidebarPath);

  const versionsMetadata = await readVersionsMetadata({context, options});

  const pluginId = options.id;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-docs',
  );
  const dataDir = path.join(pluginDataDirRoot, pluginId);
  const aliasedSource = (source: string) =>
    `~docs/${posixPath(path.relative(pluginDataDirRoot, source))}`;

  // TODO env should be injected into all plugins
  const env = process.env.NODE_ENV as DocEnv;

  return {
    name: 'docusaurus-plugin-content-docs',

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
        .action((version: unknown) =>
          cliDocsVersionCommand(version, options, context),
        );
    },

    getTranslationFiles({content}) {
      return getLoadedContentTranslationFiles(content);
    },

    getPathsToWatch() {
      function getVersionPathsToWatch(version: VersionMetadata): string[] {
        const result = [
          ...options.include.flatMap((pattern) =>
            getContentPathList(version).map(
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
        function processVersionDoc(docFile: DocFile) {
          return processDocMetadata({
            docFile,
            versionMetadata,
            context,
            options,
            env,
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

        // TODO we only ever need draftIds in further code, not full draft items
        // To simplify and prevent mistakes, avoid exposing draft
        // replace draft=>draftIds in content loaded
        const [drafts, docs] = _.partition(docsBase, (doc) => doc.draft);

        const sidebars = await loadSidebars(versionMetadata.sidebarFilePath, {
          sidebarItemsGenerator: options.sidebarItemsGenerator,
          numberPrefixParser: options.numberPrefixParser,
          docs,
          drafts,
          version: versionMetadata,
          sidebarOptions: {
            sidebarCollapsed: options.sidebarCollapsed,
            sidebarCollapsible: options.sidebarCollapsible,
          },
          categoryLabelSlugger: createSlugger(),
        });

        const sidebarsUtils = createSidebarsUtils(sidebars);

        const docsById = createDocsByIdIndex(docs);
        const allDocIds = Object.keys(docsById);

        sidebarsUtils.checkLegacyVersionedSidebarNames({
          sidebarFilePath: versionMetadata.sidebarFilePath as string,
          versionMetadata,
        });
        sidebarsUtils.checkSidebarsDocIds({
          allDocIds,
          sidebarFilePath: versionMetadata.sidebarFilePath as string,
          versionMetadata,
        });

        return {
          ...versionMetadata,
          docs: addDocNavigation({
            docs,
            sidebarsUtils,
          }),
          drafts,
          sidebars,
        };
      }

      async function loadVersion(versionMetadata: VersionMetadata) {
        try {
          return await doLoadVersion(versionMetadata);
        } catch (err) {
          logger.error`Loading of version failed for version name=${versionMetadata.versionName}`;
          throw err;
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
      const versions: FullVersion[] = content.loadedVersions.map(toFullVersion);

      await createAllRoutes({
        baseUrl,
        versions,
        options,
        actions,
        aliasedSource,
      });

      actions.setGlobalData({
        path: normalizeUrl([baseUrl, options.routeBasePath]),
        versions: versions.map(toGlobalDataVersion),
        breadcrumbs: options.breadcrumbs,
      });
    },

    configureWebpack(_config, isServer, utils, content) {
      const {
        rehypePlugins,
        remarkPlugins,
        beforeDefaultRehypePlugins,
        beforeDefaultRemarkPlugins,
      } = options;

      function getSourceToPermalink(): SourceToPermalink {
        const allDocs = content.loadedVersions.flatMap((v) => v.docs);
        return Object.fromEntries(
          allDocs.map(({source, permalink}) => [source, permalink]),
        );
      }

      const docsMarkdownOptions: DocsMarkdownOption = {
        siteDir,
        sourceToPermalink: getSourceToPermalink(),
        versionsMetadata,
        onBrokenMarkdownLink: (brokenMarkdownLink) => {
          logger.report(
            siteConfig.onBrokenMarkdownLinks,
          )`Docs markdown link couldn't be resolved: (url=${brokenMarkdownLink.link}) in path=${brokenMarkdownLink.filePath} for version number=${brokenMarkdownLink.contentPaths.versionName}`;
        },
      };

      function createMDXLoaderRule(): RuleSetRule {
        const contentDirs = versionsMetadata
          .flatMap(getContentPathList)
          // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
          .map(addTrailingPathSeparator);
        return {
          test: /\.mdx?$/i,
          include: contentDirs,
          use: [
            {
              loader: require.resolve('@docusaurus/mdx-loader'),
              options: {
                admonitions: options.admonitions,
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
                // Assets allow to convert some relative images paths to
                // require(...) calls
                createAssets: ({
                  frontMatter,
                }: {
                  frontMatter: DocFrontMatter;
                }) => ({
                  image: frontMatter.image,
                }),
                markdownConfig: siteConfig.markdown,
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
