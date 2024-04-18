/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {
  aliasedSitePath,
  docuHash,
  addTrailingPathSeparator,
  createAbsoluteFilePathMatcher,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/utils';
import {createAllRoutes} from './routes';
import {
  createPagesContentPaths,
  getContentPathList,
  loadPagesContent,
} from './content';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {
  PluginOptions,
  LoadedContent,
  PageFrontMatter,
} from '@docusaurus/plugin-content-pages';

export default function pluginContentPages(
  context: LoadContext,
  options: PluginOptions,
): Plugin<LoadedContent | null> {
  const {siteConfig, siteDir, generatedFilesDir} = context;

  const contentPaths = createPagesContentPaths({context, options});

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-pages',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

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
      return loadPagesContent({context, options, contentPaths});
    },

    async contentLoaded({content, actions}) {
      if (!content) {
        return;
      }
      await createAllRoutes({content, options, actions});
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
