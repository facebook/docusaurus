/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import {
  encodePath,
  fileToPath,
  aliasedSitePath,
  docuHash,
  getPluginI18nPath,
  getFolderContainingFile,
  addTrailingPathSeparator,
  Globby,
  createAbsoluteFilePathMatcher,
  normalizeUrl,
} from '@docusaurus/utils';
import {
  LoadContext,
  Plugin,
  OptionValidationContext,
  ValidationResult,
  ConfigureWebpackUtils,
} from '@docusaurus/types';
import {Configuration} from 'webpack';
import admonitions from 'remark-admonitions';
import {PluginOptionSchema} from './pluginOptionSchema';
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

export function getContentPathList(contentPaths: PagesContentPaths): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

const isMarkdownSource = (source: string) =>
  source.endsWith('.md') || source.endsWith('.mdx');

export default function pluginContentPages(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null> {
  if (options.admonitions) {
    options.remarkPlugins = options.remarkPlugins.concat([
      [admonitions, options.admonitions || {}],
    ]);
  }
  const {
    siteConfig,
    siteDir,
    generatedFilesDir,
    i18n: {currentLocale},
  } = context;

  const contentPaths: PagesContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      siteDir,
      locale: currentLocale,
      pluginName: 'docusaurus-plugin-content-pages',
      pluginId: options.id,
    }),
  };

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-pages',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include = []} = options;
      return getContentPathList(contentPaths).flatMap((contentPath) =>
        include.map((pattern) => `${contentPath}/${pattern}`),
      );
    },

    async loadContent() {
      const {include} = options;

      if (!fs.existsSync(contentPaths.contentPath)) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await Globby(include, {
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
        const permalink = normalizeUrl([
          baseUrl,
          options.routeBasePath,
          encodePath(fileToPath(relativeSource)),
        ]);
        if (isMarkdownSource(relativeSource)) {
          // TODO: missing frontmatter validation/normalization here
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
      {getJSLoader}: ConfigureWebpackUtils,
    ) {
      const {
        rehypePlugins,
        remarkPlugins,
        beforeDefaultRehypePlugins,
        beforeDefaultRemarkPlugins,
      } = options;
      const contentDirs = getContentPathList(contentPaths);
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
              ].filter(Boolean),
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
}: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions> {
  const validatedOptions = validate(PluginOptionSchema, options);
  return validatedOptions;
}
