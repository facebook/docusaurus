/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {MDXOptions, SimpleProcessors} from './processor';
import type {MarkdownConfig} from '@docusaurus/types';
import type {ResolveMarkdownLink} from './remark/resolveMarkdownLinks';

export type Options = Partial<MDXOptions> & {
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
  crossCompilerCache?: Map<string, Promise<string>>; // MDX => Promise<JSX> cache
};
