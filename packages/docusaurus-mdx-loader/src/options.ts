/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {MDXOptions, SimpleProcessors} from './processor';
import type {MarkdownConfig} from '@docusaurus/types';
import type {ResolveMarkdownLink} from './remark/resolveMarkdownLinks';
import type {Options as RemarkMdxOptions} from 'remark-mdx';

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
  // Options passed to remark-mdx (only for the 'mdx' format)
  // Replaces our default {acornOptions: {ecmaVersion: 2025, sourceType: 'module'}}
  remarkMdxOptions?: RemarkMdxOptions;

  // Will usually be created by "createMDXLoaderItem"
  processors?: SimpleProcessors;
  crossCompilerCache?: Map<string, CrossCompilerCacheEntry>; // MDX => Promise<JSX> cache
};

type CrossCompilerCacheEntry = PromiseWithResolvers<string>;
