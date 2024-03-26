/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

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
} from '@docusaurus/utils';
import Yaml from 'js-yaml';

import {contentAuthorsSchema} from './options';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Content} from '@docusaurus/plugin-showcase';
import type {ShowcaseContentPaths} from './types';

export function getContentPathList(
  contentPaths: ShowcaseContentPaths,
): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

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

    getPathsToWatch() {
      const {include} = options;
      return getContentPathList(contentPaths).flatMap((contentPath) =>
        include.map((pattern) => `${contentPath}/${pattern}`),
      );
    },

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

      const filteredFiles = showcaseFiles.filter((file) =>
        file.endsWith('.yaml'),
      );

      async function processPageSourceFile(relativeSource: string) {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const sourcePath = path.join(contentPath, relativeSource);
        const aliasedSourcePath = aliasedSitePath(sourcePath, siteDir);
        const rawYaml = await fs.readFile(sourcePath, 'utf-8');
        const unsafeYaml = Yaml.load(rawYaml);
        const yaml = contentAuthorsSchema.validate(unsafeYaml);
        if (yaml.error) {
          throw new Error(`Validation failed: ${yaml.error.message}`, {
            cause: yaml.error,
          });
        }

        const {title, description, preview, website, source, tags} = yaml.value;
        return {
          title,
          description,
          preview,
          website,
          source,
          tags,
        };
      }

      async function doProcessPageSourceFile(relativeSource: string) {
        try {
          return await processPageSourceFile(relativeSource);
        } catch (err) {
          throw new Error(
            `Processing of page source file path=${relativeSource} failed.`,
            {cause: err as Error},
          );
        }
      }

      return {
        website: await Promise.all(filteredFiles.map(doProcessPageSourceFile)),
      };
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      await Promise.all(
        content.website.map(async (item) => {
          const dataAuthor = await createData(
            `${docuHash(item.title)}.json`,
            JSON.stringify(item),
          );

          addRoute({
            path: `/showcaseAll/${item.title}`,
            component: '@theme/ShowcaseDetails',
            modules: {
              content: dataAuthor,
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

    configureWebpack(_config, isServer, utils, content) {
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
                    // isMDXPartial: createAbsoluteFilePathMatcher(
                    //   options.exclude,
                    //   contentDirs,
                    // ),
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
