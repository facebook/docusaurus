/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs';
import path from 'path';
import {
  encodePath,
  fileToPath,
  aliasedSitePath,
  docuHash,
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

import {PluginOptions, LoadedContent, Metadata} from './types';

const DEFAULT_OPTIONS: PluginOptions = {
  path: 'src/pages', // Path to data on filesystem, relative to site dir.
  routeBasePath: '', // URL Route.
  include: ['**/*.{js,jsx,ts,tsx,md,mdx}'], // Extensions to include.
  mdxPageComponent: '@theme/MDXPage',
  remarkPlugins: [],
  rehypePlugins: [],
  admonitions: {},
};

const isMarkdownSource = (source: string) =>
  source.endsWith('.md') || source.endsWith('.mdx');

export default function pluginContentPages(
  context: LoadContext,
  opts: Partial<PluginOptions>,
): Plugin<LoadedContent | null, typeof PluginOptionSchema> {
  const options: PluginOptions = {...DEFAULT_OPTIONS, ...opts};
  if (options.admonitions) {
    options.remarkPlugins = options.remarkPlugins.concat([
      [admonitions, opts.admonitions || {}],
    ]);
  }
  const {siteConfig, siteDir, generatedFilesDir} = context;

  const contentPath = path.resolve(siteDir, options.path);

  const dataDir = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-pages',
  );

  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include = []} = options;
      const globPattern = include.map((pattern) => `${contentPath}/${pattern}`);
      return [...globPattern];
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
      const pagesDir = contentPath;

      if (!fs.existsSync(pagesDir)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await globby(include, {
        cwd: pagesDir,
      });

      function toMetadata(relativeSource: string): Metadata {
        const source = path.join(pagesDir, relativeSource);
        const aliasedSource = aliasedSitePath(source, siteDir);
        const pathName = encodePath(fileToPath(relativeSource));
        const permalink = pathName.replace(/^\//, baseUrl || '');
        if (isMarkdownSource(relativeSource)) {
          return {
            type: 'mdx',
            permalink,
            source: aliasedSource,
          };
        } else {
          return {
            type: 'jsx',
            permalink,
            source: aliasedSource,
          };
        }
      }

      return pagesFiles.map(toMetadata);
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
            '~pages': dataDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [contentPath],
              use: [
                getCacheLoader(isServer),
                getBabelLoader(isServer),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    // Note that metadataPath must be the same/in-sync as
                    // the path from createData for each MDX.
                    metadataPath: (mdxPath: string) => {
                      const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedSource)}.json`,
                      );
                    },
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
