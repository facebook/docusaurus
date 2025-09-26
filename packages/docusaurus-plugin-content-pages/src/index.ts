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
  getContentPathList,
  DEFAULT_PLUGIN_ID,
} from '@docusaurus/utils';
import {createMDXLoaderRule} from '@docusaurus/mdx-loader';
import {createAllRoutes} from './routes';
import {createPagesContentPaths, loadPagesContent} from './content';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {
  PluginOptions,
  LoadedContent,
  PageFrontMatter,
} from '@docusaurus/plugin-content-pages';
import type {RuleSetRule} from 'webpack';

export default async function pluginContentPages(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin<LoadedContent | null>> {
  const {siteConfig, siteDir, generatedFilesDir} = context;

  const contentPaths = createPagesContentPaths({context, options});

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    'docusaurus-plugin-content-pages',
  );
  const dataDir = path.join(pluginDataDirRoot, options.id ?? DEFAULT_PLUGIN_ID);

  async function createPagesMDXLoaderRule(): Promise<RuleSetRule> {
    const {
      admonitions,
      rehypePlugins,
      remarkPlugins,
      recmaPlugins,
      beforeDefaultRehypePlugins,
      beforeDefaultRemarkPlugins,
    } = options;
    const contentDirs = getContentPathList(contentPaths);

    return createMDXLoaderRule({
      include: contentDirs
        // Trailing slash is important, see https://github.com/facebook/docusaurus/pull/3970
        .map(addTrailingPathSeparator),
      options: {
        useCrossCompilerCache:
          siteConfig.future.experimental_faster.mdxCrossCompilerCache,
        admonitions,
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
          const aliasedSource = aliasedSitePath(mdxPath, siteDir);
          return path.join(dataDir, `${docuHash(aliasedSource)}.json`);
        },
        // createAssets converts relative paths to require() calls
        createAssets: ({frontMatter}: {frontMatter: PageFrontMatter}) => ({
          image: frontMatter.image,
        }),
        markdownConfig: siteConfig.markdown,
      },
    });
  }

  const pagesMDXLoaderRule = await createPagesMDXLoaderRule();

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
      return {
        module: {
          rules: [pagesMDXLoaderRule],
        },
      };
    },
  };
}

export {validateOptions} from './options';
