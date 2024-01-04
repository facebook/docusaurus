/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {
  encodePath,
  fileToPath,
  aliasedSitePath,
  docuHash,
  getPluginI18nPath,
  addTrailingPathSeparator,
  Globby,
  createAbsoluteFilePathMatcher,
  normalizeUrl,
  DEFAULT_PLUGIN_ID,
  parseMarkdownFile,
  isUnlisted,
  isDraft,
  findAsyncSequential,
} from '@docusaurus/utils';
import {validatePageFrontMatter} from './frontMatter';

import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PagesContentPaths} from './types';
import type {
  PluginOptions,
  Metadata,
  LoadedContent,
  PageFrontMatter,
} from '@docusaurus/plugin-content-pages';

export function getContentPathList(contentPaths: PagesContentPaths): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

async function getLocalizedSource({
  relativeSource,
  contentPaths,
  locale,
}: {
  relativeSource: string;
  contentPaths: PagesContentPaths;
  locale: string;
}) {
  const {name, dir, ext} = path.parse(relativeSource);

  // Lookup in localized folder in priority
  const possibleSources = getContentPathList(contentPaths).flatMap(
    (contentPath) => [
      path.join(contentPath, dir, `${name}.${locale}${ext}`),
      path.join(contentPath, relativeSource),
    ],
  );

  const localizedSource = await findAsyncSequential(
    possibleSources,
    fs.pathExists,
  );

  if (!localizedSource) {
    throw new Error('unexpected');
  }

  return localizedSource;
}

function filterLocaleExtensionFiles(
  files: string[],
  locales: string[],
): string[] {
  const localeExtensions = locales.map((locale) => `.${locale}`);
  return files.filter((file) => {
    const {name} = path.parse(file);
    return !localeExtensions.includes(path.extname(name));
  });
}

const isMarkdownSource = (source: string) =>
  source.endsWith('.md') || source.endsWith('.mdx');

export default function pluginContentPages(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null> {
  const {siteConfig, siteDir, generatedFilesDir, localizationDir} = context;

  const contentPaths: PagesContentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-pages',
      pluginId: options.id,
    }),
  };

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-pages',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  async function getPageFiles() {
    const files = await Globby(options.include, {
      cwd: contentPaths.contentPath,
      ignore: options.exclude,
    });
    return filterLocaleExtensionFiles(files, context.i18n.locales);
  }

  return {
    name: 'docusaurus-plugin-content-pages',

    getPathsToWatch() {
      const {include} = options;
      return getContentPathList(contentPaths).flatMap((contentPath) =>
        include.map((pattern) => `${contentPath}/${pattern}`),
      );
    },

    async loadContent() {
      if (!(await fs.pathExists(contentPaths.contentPath))) {
        return null;
      }

      const {baseUrl} = siteConfig;
      const pagesFiles = await getPageFiles();

      async function processPageSourceFile(
        relativeSource: string,
      ): Promise<Metadata | undefined> {
        const source = await getLocalizedSource({
          relativeSource,
          contentPaths,
          locale: context.i18n.currentLocale,
        });
        const aliasedSourcePath = aliasedSitePath(source, siteDir);
        const permalink = normalizeUrl([
          baseUrl,
          options.routeBasePath,
          encodePath(fileToPath(relativeSource)),
        ]);
        if (!isMarkdownSource(relativeSource)) {
          return {
            type: 'jsx',
            permalink,
            source: aliasedSourcePath,
          };
        }
        const content = await fs.readFile(source, 'utf-8');
        const {
          frontMatter: unsafeFrontMatter,
          contentTitle,
          excerpt,
        } = await parseMarkdownFile({
          filePath: source,
          fileContent: content,
          parseFrontMatter: siteConfig.markdown.parseFrontMatter,
        });
        const frontMatter = validatePageFrontMatter(unsafeFrontMatter);

        if (isDraft({frontMatter})) {
          return undefined;
        }
        const unlisted = isUnlisted({frontMatter});

        return {
          type: 'mdx',
          permalink,
          source: aliasedSourcePath,
          title: frontMatter.title ?? contentTitle,
          description: frontMatter.description ?? excerpt,
          frontMatter,
          unlisted,
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

      return (
        await Promise.all(pagesFiles.map(doProcessPageSourceFile))
      ).filter(Boolean) as Metadata[];
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

    configureWebpack() {
      const {
        admonitions,
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
              test: /\.mdx?$/i,
              include: contentDirs
                // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
                .map(addTrailingPathSeparator),
              use: [
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: {
                    admonitions,
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
                      const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                      return path.join(
                        dataDir,
                        `${docuHash(aliasedSource)}.json`,
                      );
                    },
                    // Assets allow to convert some relative images paths to
                    // require(...) calls
                    createAssets: ({
                      frontMatter,
                    }: {
                      frontMatter: PageFrontMatter;
                    }) => ({
                      image: frontMatter.image,
                    }),
                    markdownConfig: siteConfig.markdown,
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

export {validateOptions} from './options';
