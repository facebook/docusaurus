/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs';
import path from 'path';
import minimatch from 'minimatch';
import slash from 'slash';
import {
  encodePath,
  fileToPath,
  aliasedSitePath,
  docuHash,
  getPluginI18nPath,
  getFolderContainingFile,
} from '@docusaurus/utils';
import {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ValidationResult,
  ConfigureWebpackUtils,
} from '@docusaurus/types';
import {Configuration, Loader} from 'webpack';
import admonitions from 'remark-admonitions';
import {PluginOptionSchema} from './pluginOptionSchema';
import {ValidationError} from '@hapi/joi';
import {
  DEFAULT_PLUGIN_ID,
  STATIC_DIR_NAME,
} from '@docusaurus/core/lib/constants';

import {
  PluginOptions,
  LoadedContent,
  Metadata,
  PagesContentPaths,
} from './types';
import {flatten} from 'lodash';

export function getContentPathList(contentPaths: PagesContentPaths) {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

const isMarkdownSource = (source: string) =>
  source.endsWith('.md') || source.endsWith('.mdx');

export default function pluginContentPages(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null, typeof PluginOptionSchema> {
  if (options.admonitions) {
    options.remarkPlugins = options.remarkPlugins.concat([
      [admonitions, options.admonitions || {}],
    ]);
  }
  const {
    siteConfig,
    siteDir,
    generatedFilesDir,
    localization: {currentLocale},
  } = context;

  const contentPaths: PagesContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      siteDir,
      currentLocale,
      pluginFolderName: 'pages',
      pluginId: options.id!,
    }),
  };

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-pages',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  const excludeRegex = new RegExp(
    options.exclude
      .map((pattern) => minimatch.makeRe(pattern).source)
      .join('|'),
  );
  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include = []} = options;
      return flatten(
        getContentPathList(contentPaths).map((contentPath) => {
          return include.map((pattern) => `${contentPath}/${pattern}`);
        }),
      );
    },

    getClientModules() {
      const modules = [];

      if (options.admonitions) {
        modules.push(require.resolve('remark-admonitions/styles/infima.css'));
      }

      return modules;
    },

    async loadContent() {
      const {include} = options;

      if (!fs.existsSync(contentPaths.contentPath)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await globby(include, {
        cwd: contentPaths.contentPath,
        ignore: options.exclude,
      });

      async function toMetadata(relativeSource: string): Promise<Metadata> {
        // Lookup in localized folder in priority
        const contentPath = await getFolderContainingFile(
          getContentPathList(contentPaths),
          relativeSource,
        );

        const source = path.join(contentPath, relativeSource);
        const aliasedSourcePath = aliasedSitePath(source, siteDir);
        const pathName = encodePath(fileToPath(relativeSource));
        const permalink = pathName.replace(/^\//, baseUrl || '');
        if (isMarkdownSource(relativeSource)) {
          return {
            type: 'mdx',
            permalink,
            source: aliasedSourcePath,
          };
        } else {
          return {
            type: 'jsx',
            permalink,
            source: aliasedSourcePath,
          };
        }
      }

      return Promise.all(pagesFiles.map(toMetadata));
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }

      const {addRoute, createData} = actions;

      await Promise.all(
        content.map(async (metadata) => {
          const {permalink, source} = metadata;
          if (metadata.type === 'mdx') {
            await createData(
              // Note that this created data path must be in sync with
              // metadataPath provided to mdx-loader.
              `${docuHash(metadata.source)}.json`,
              JSON.stringify(metadata, null, 2),
            );
            addRoute({
              path: permalink,
              component: options.mdxPageComponent,
              exact: true,
              modules: {
                content: source,
              },
            });
          } else {
            addRoute({
              path: permalink,
              component: source,
              exact: true,
              modules: {
                config: `@generated/docusaurus.config`,
              },
            });
          }
        }),
      );
    },

    configureWebpack(
      _config: Configuration,
      isServer: boolean,
      {getBabelLoader, getCacheLoader}: ConfigureWebpackUtils,
    ) {
      const {rehypePlugins, remarkPlugins} = options;
      return {
        resolve: {
          alias: {
            '~pages': pluginDataDirRoot,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: getContentPathList(contentPaths),
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    staticDir: path.join(siteDir, STATIC_DIR_NAME),
                    // Note that metadataPath must be the same/in-sync as
                    // the path from createData for each MDX.
                    metadataPath: (mdxPath: string) => {
                      if (excludeRegex.test(slash(mdxPath))) {
                        return null;
                      }
                      const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedSource)}.json`,
                      );
                    },
                    forbidFrontMatter: (mdxPath: string) =>
                      excludeRegex.test(slash(mdxPath)),
                  },
                },
                {
                  loader: path.resolve(__dirname, './markdownLoader.js'),
                  options: {
                    // siteDir,
                    // contentPath,
                  },
                },
              ].filter(Boolean) as Loader[],
            },
          ],
        },
      };
    },
  };
}

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<PluginOptions, ValidationError>): ValidationResult<
  PluginOptions,
  ValidationError
> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
