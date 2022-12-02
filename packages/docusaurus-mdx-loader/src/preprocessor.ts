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
import type {MDXOptions} from './loader';

export default function preprocessContent(
  md: string,
  {admonitions}: {admonitions: MDXOptions['admonitions'] | undefined},
): string {
  md = unwrapMdxCodeBlocks(md);
  md = escapeMarkdownHeadingIds(md);
  if (admonitions) {
    const {keywords} = normalizeAdmonitionOptions(admonitions);
    md = admonitionTitleToDirectiveLabel(md, keywords);
  }
  // TODO MDX 2 doesn't like our unescaped html comments <
  md = md.replaceAll('<!--', '\\<!--');
  return md;
}
