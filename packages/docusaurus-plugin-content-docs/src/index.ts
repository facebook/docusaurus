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
  resolveMarkdownLinkPathname,
  DEFAULT_PLUGIN_ID,
  type TagsFile,
} from '@docusaurus/utils';
import {
  getTagsFile,
  getTagsFilePathsToWatch,
} from '@docusaurus/utils-validation';
import {createMDXLoaderRule} from '@docusaurus/mdx-loader';
import {loadSidebars, resolveSidebarPathOption} from './sidebars';
import {CategoryMetadataFilenamePattern} from './sidebars/generator';
import {
  readVersionDocs,
  processDocMetadata,
  addDocNavigation,
  type DocEnv,
  createDocsByIdIndex,
} from './docs';
import {
  getVersionFromSourceFilePath,
  readVersionsMetadata,
  toFullVersion,
} from './versions';
import cliDocs from './cli';
import {VERSIONS_JSON_FILE} from './constants';
import {toGlobalDataVersion} from './globalData';
import {
  translateLoadedContent,
  getLoadedContentTranslationFiles,
} from './translations';
import {createAllRoutes} from './routes';
import {createSidebarsUtils} from './sidebars/utils';

import {createContentHelpers} from './contentHelpers';
import type {
  PluginOptions,
  DocMetadataBase,
  VersionMetadata,
  DocFrontMatter,
  LoadedContent,
  LoadedVersion,
} from '@docusaurus/plugin-content-docs';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {DocFile, FullVersion} from './types';
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
  // TODO Docusaurus v4 breaking change
  //  module aliasing should be automatic
  //  we should never find local absolute FS paths in the codegen registry
  const aliasedSource = (source: string) =>
    `~docs/${posixPath(path.relative(pluginDataDirRoot, source))}`;

  // TODO env should be injected into all plugins
  const env = process.env.NODE_ENV as DocEnv;

  const contentHelpers = createContentHelpers();

  async function createDocsMDXLoaderRule(): Promise<RuleSetRule> {
    const {
      rehypePlugins,
      remarkPlugins,
      recmaPlugins,
      beforeDefaultRehypePlugins,
      beforeDefaultRemarkPlugins,
    } = options;
    const contentDirs = versionsMetadata
      .flatMap(getContentPathList)
      // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
      .map(addTrailingPathSeparator);

    return createMDXLoaderRule({
      include: contentDirs,
      options: {
        useCrossCompilerCache:
          siteConfig.future.experimental_faster.mdxCrossCompilerCache,
        admonitions: options.admonitions,
        remarkPlugins,
        rehypePlugins,
        recmaPlugins,
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
        // createAssets converts relative paths to require() calls
        createAssets: ({frontMatter}: {frontMatter: DocFrontMatter}) => ({
          image: frontMatter.image,
        }),
        markdownConfig: siteConfig.markdown,
        resolveMarkdownLink: ({linkPathname, sourceFilePath}) => {
          const version = getVersionFromSourceFilePath(
            sourceFilePath,
            versionsMetadata,
          );
          const permalink = resolveMarkdownLinkPathname(linkPathname, {
            sourceFilePath,
            sourceToPermalink: contentHelpers.sourceToPermalink,
            siteDir,
            contentPaths: version,
          });
          if (permalink === null) {
            logger.report(
              siteConfig.onBrokenMarkdownLinks,
            )`Docs markdown link couldn't be resolved: (url=${linkPathname}) in source file path=${sourceFilePath} for version number=${version.versionName}`;
          }
          return permalink;
        },
      },
    });
  }

  const docsMDXLoaderRule = await createDocsMDXLoaderRule();

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
          cliDocs.cliDocsVersionCommand(version, options, context),
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
          ...getTagsFilePathsToWatch({
            contentPaths: version,
            tags: options.tags,
          }),
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
        tagsFile: TagsFile | null,
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
            tagsFile,
          });
        }
        return Promise.all(docFiles.map(processVersionDoc));
      }

      async function doLoadVersion(
        versionMetadata: VersionMetadata,
      ): Promise<LoadedVersion> {
        const tagsFile = await getTagsFile({
          contentPaths: versionMetadata,
          tags: options.tags,
        });

        const docsBase: DocMetadataBase[] = await loadVersionDocsBase(
          versionMetadata,
          tagsFile,
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
      contentHelpers.updateContent(content);

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

    configureWebpack() {
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
          rules: [docsMDXLoaderRule],
        },
      };
    },
  };
}

export {validateOptions} from './options';
