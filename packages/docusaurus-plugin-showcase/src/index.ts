/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 

import fs from 'fs-extra';
import path from 'path';
import {
  DEFAULT_PLUGIN_ID,
  addTrailingPathSeparator,
  aliasedSitePath,
  docuHash,
  getFolderContainingFile,
  getPluginI18nPath,
  Globby,
  parseMarkdownFile,
  aliasedSitePathToRelativePath,
  createAbsoluteFilePathMatcher,
} from '@docusaurus/utils';
import Yaml from 'js-yaml';

import {validateShowcaseFrontMatter} from './options';
import type {LoadContext, Plugin, RouteMetadata} from '@docusaurus/types';
import type {PluginOptions, Content} from '@docusaurus/plugin-showcase';
import type {ShowcaseContentPaths} from './types';

export function getContentPathList(
  contentPaths: ShowcaseContentPaths,
): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

const isMarkdownSource = (source: string) =>
  source.endsWith('.md') || source.endsWith('.mdx');

export default function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Plugin<Content | null> {
  const {siteConfig, siteDir, generatedFilesDir, localizationDir} = context;

  const contentPaths: ShowcaseContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-pages',
      pluginId: options.id,
    }),
  };

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-showcase',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  return {
    name: 'docusaurus-plugin-showcase',

    // todo doesn't work
    // getPathsToWatch() {
    //   const {include} = options;
    //   return getContentPathList(contentPaths).flatMap((contentPath) =>
    //     include.map((pattern) => `${contentPath}/${pattern}`),
    //   );
    // },

    async loadContent() {
      const {include} = options;

      if (!(await fs.pathExists(contentPaths.contentPath))) {
        return null;
      }

      // const {baseUrl} = siteConfig;
      const showcaseFiles = await Globby(include, {
        cwd: contentPaths.contentPath,
        ignore: options.exclude,
      });

      async function processShowcaseSourceFile(relativeSource: string) {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const sourcePath = path.join(contentPath, relativeSource);
        const aliasedSourcePath = aliasedSitePath(sourcePath, siteDir);
        if (!isMarkdownSource(sourcePath)) {
          const rawYaml = await fs.readFile(sourcePath, 'utf-8');
          const unsafeYaml = Yaml.load(rawYaml) as {[key: string]: unknown};
          const yaml = validateShowcaseFrontMatter(unsafeYaml);
          return {
            type: 'yaml',
            ...yaml,
          };
        }
        const rawMarkdown = await fs.readFile(sourcePath, 'utf-8');
        const {frontMatter: unsafeFrontMatter, content} =
          await parseMarkdownFile({
            filePath: sourcePath,
            fileContent: rawMarkdown,
            parseFrontMatter: siteConfig.markdown?.parseFrontMatter,
          });
        const frontMatter = validateShowcaseFrontMatter(unsafeFrontMatter);
        return {
          type: 'markdown',
          ...frontMatter,
          content,
          sourcePath: aliasedSourcePath,
        };
      }

      async function doProcessShowcaseSourceFile(relativeSource: string) {
        try {
          return await processShowcaseSourceFile(relativeSource);
        } catch (err) {
          throw new Error(
            `Processing of page source file path=${relativeSource} failed.`,
            {cause: err as Error},
          );
        }
      }

      return {
        website: await Promise.all(
          showcaseFiles.map(doProcessShowcaseSourceFile),
        ),
      };
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      function createPageRouteMetadata(
        metadata: Content['website'][number],
      ): RouteMetadata {
        return {
          sourceFilePath: aliasedSitePathToRelativePath(metadata.sourcePath!),
          // TODO add support for last updated date in the page plugin
          //  at least for Markdown files
          // lastUpdatedAt: metadata.lastUpdatedAt,
          lastUpdatedAt: undefined,
        };
      }

      await Promise.all(
        content.website.map(async (item) => {
          if (item.type === 'yaml') {
            return;
          }
          await createData(
            `${docuHash(item.sourcePath!)}.json`,
            JSON.stringify(item),
          );

          const routeMetadata = createPageRouteMetadata(item);

          const mdxPath = aliasedSitePathToRelativePath(item.sourcePath!);
          console.log('mdxPath', mdxPath);

          addRoute({
            path: `/showcaseAll/${item.title}`,
            component: '@theme/ShowcaseDetails',
            metadata: routeMetadata,
            modules: {
              content: item.sourcePath!,
            },
            exact: true,
          });
        }),
      );

      const showcaseAllData = await createData(
        'showcaseAll.json',
        JSON.stringify(content.website),
      );

      addRoute({
        path: '/showcaseAll',
        component: '@theme/Showcase',
        modules: {
          content: showcaseAllData,
        },
        exact: true,
      });
    },

    configureWebpack() {
      const contentDirs = getContentPathList(contentPaths);

      return {
        resolve: {
          alias: {
            '~showcase': pluginDataDirRoot,
          },
        },
        module: {
          rules: [
            {
              test: /\.mdx?$/i,
              include: contentDirs
                // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
                .map(addTrailingPathSeparator),
              use: [
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
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
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedPath)}.json`,
                      );
                    },
                    // Assets allow to convert some relative images paths to
                    // require() calls
                    createAssets: ({
                      frontMatter,
                    }: {
                      frontMatter: Content['website'][number];
                    }) => ({
                      image: frontMatter.preview,
                    }),
                    markdownConfig: siteConfig.markdown,
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdownLoader.js'),
                },
              ].filter(Boolean),
            },
          ],
        },
      };
    },
  };
}

export {validateOptions} from './options';
