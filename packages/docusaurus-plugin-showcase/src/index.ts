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
} from '@docusaurus/utils';
import Yaml from 'js-yaml';

import {contentAuthorsSchema} from './options';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {
  PluginOptions,
  Content,
  ShowcaseMetadata,
} from '@docusaurus/plugin-showcase';

// https://stackoverflow.com/a/71166133
const walk = async (dirPath: string): Promise<any[]> =>
  Promise.all(
    await fs.readdir(dirPath, {withFileTypes: true}).then((entries) =>
      entries.map((entry) => {
        const childPath = path.join(dirPath, entry.name);
        return entry.isDirectory() ? walk(childPath) : childPath;
      }),
    ),
  );

export default function pluginContentShowcase(
  context: LoadContext,
  options: PluginOptions,
): Plugin<Content> {
  const {siteConfig, siteDir, generatedFilesDir} = context;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-showcase',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  const showcasePath = path.join(siteDir, options.path);

  return {
    name: 'docusaurus-plugin-showcase',

    // getPathsToWatch() {
    //   return [path.join(siteDir, options.path, 'authors.yaml')];
    // },

    async loadContent(): Promise<Content> {
      const files: string[] = await walk(path.join(siteDir, options.path));
      const filteredFiles = files
        .flat(Number.POSITIVE_INFINITY)
        .filter((file) => file.endsWith('.yaml'));

      const contentPromises = filteredFiles.map(async (file) => {
        const rawYaml = await fs.readFile(path.join(file), 'utf-8');
        const yaml = Yaml.load(rawYaml);
        const parsedYaml = contentAuthorsSchema.validate(yaml);

        if (parsedYaml.error) {
          throw new Error(`Validation failed: ${parsedYaml.error.message}`, {
            cause: parsedYaml.error,
          });
        }

        const {title, description, preview, website, source, tags} =
          parsedYaml.value;

        return {
          title,
          description,
          preview,
          website,
          source,
          tags,
        };
      });

      const content = await Promise.all(contentPromises);
      return {
        website: content,
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
      return {
        resolve: {
          alias: {
            '~blog': pluginDataDirRoot,
          },
        },
        module: {
          rules: [
            {
              test: /\.mdx?$/i,
              include: [...showcasePath]
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
                    metadataPath: (mdxPath: string) => {
                      // Note that metadataPath must be the same/in-sync as
                      // the path from createData for each MDX.
                      const aliasedPath = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedPath)}.json`,
                      );
                    },
                    // For blog posts a title in markdown is always removed
                    // Blog posts title are rendered separately
                    removeContentTitle: true,

                    // Assets allow to convert some relative images paths to
                    // require() calls
                    // createAssets: ({
                    //   frontMatter,
                    //   metadata,
                    // }: {
                    //   frontMatter: Content['website'][number];
                    //   metadata: ShowcaseMetadata;
                    // }): Assets => ({
                    //   image: frontMatter.preview,
                    //   authorsImageUrls: metadata.frontMatter.preview.map(
                    //     (author) => author.imageURL,
                    //   ),
                    // }),
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
