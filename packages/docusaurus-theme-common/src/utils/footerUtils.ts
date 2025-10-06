/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {FooterColumnLinkItem, FooterLinkItem} from '@docusaurus/types';

/**
 * A rough duck-typing about whether the `footer.links` is intended to be multi-
 * column.
 */
export function isMultiColumnFooterLinks(
  links: FooterColumnLinkItem[] | FooterLinkItem[],
): links is FooterColumnLinkItem[] {
  const [maybeFirstLink] = links;
  return maybeFirstLink !== undefined && 'title' in maybeFirstLink;
}
