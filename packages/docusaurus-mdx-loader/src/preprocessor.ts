/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  escapeMarkdownHeadingIds,
  unwrapMdxCodeBlocks,
  admonitionTitleToDirectiveLabel,
} from '@docusaurus/utils';
import {normalizeAdmonitionOptions} from './remark/admonitions';
import type {Options} from './loader';

export default function preprocessContent(
  md: string,
  {
    markdownConfig,
    admonitions,
  }: {
    markdownConfig: Options['markdownConfig'];
    admonitions: Options['admonitions'] | undefined;
  },
): string {
  md = unwrapMdxCodeBlocks(md);
  if (markdownConfig.mdx1Compat.headingIds) {
    md = escapeMarkdownHeadingIds(md);
  }
  if (markdownConfig.mdx1Compat.admonitions && admonitions) {
    const {keywords} = normalizeAdmonitionOptions(admonitions);
    md = admonitionTitleToDirectiveLabel(md, keywords);
  }
  return md;
}
