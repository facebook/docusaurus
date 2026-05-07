/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import type {MDXOptions, SimpleProcessors} from './processor';
import type {MarkdownConfig} from '@docusaurus/types';
import type {ResolveMarkdownLink} from './remark/resolveMarkdownLinks';
import type {PromiseWithResolvers} from './utils';

export type Options = Partial<MDXOptions> & {
  dependencies?: string[];

  markdownConfig: MarkdownConfig;
  staticDirs: string[];
  siteDir: string;
  isMDXPartial?: (filePath: string) => boolean;
  isMDXPartialFrontMatterWarningDisabled?: boolean;
  removeContentTitle?: boolean;
  metadataPath?: (filePath: string) => string;
  createAssets?: (metadata: {
    filePath: string;
    frontMatter: {[key: string]: unknown};
  }) => {[key: string]: unknown};
  resolveMarkdownLink?: ResolveMarkdownLink;

  // Will usually be created by "createMDXLoaderItem"
  processors?: SimpleProcessors;
  crossCompilerCache?: Map<string, CrossCompilerCacheEntry>; // MDX => Promise<JSX> cache
};

type CrossCompilerCacheEntry = PromiseWithResolvers<string>;

export type MDXLoaderOptionsBuilderSiteConfig = {
  staticDirectories: string[];
  markdown: MarkdownConfig;
};

export function createMDXLoaderOptionsBuilder({
  siteDir,
  siteConfig,
  useCrossCompilerCache,
}: {
  siteDir: string;
  siteConfig: MDXLoaderOptionsBuilderSiteConfig;
  useCrossCompilerCache?: boolean;
}): {
  build: (
    overrides: Omit<Options, 'siteDir' | 'staticDirs' | 'markdownConfig'>,
  ) => Options;
} {
  const baseOptions: Pick<
    Options,
    'siteDir' | 'staticDirs' | 'markdownConfig' | 'useCrossCompilerCache'
  > = {
    siteDir,
    staticDirs: siteConfig.staticDirectories.map((dir) =>
      path.resolve(siteDir, dir),
    ),
    markdownConfig: siteConfig.markdown,
    useCrossCompilerCache,
  };

  return {
    build(overrides) {
      return {
        ...baseOptions,
        ...overrides,
      };
    },
  };
}
