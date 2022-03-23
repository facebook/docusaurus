/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {MultiColumnFooter, SimpleFooter} from './useThemeConfig';

/**
 * A rough duck-typing about whether the `footer.links` is intended to be multi-
 * column.
 */
export function isMultiColumnFooterLinks(
  links: MultiColumnFooter['links'] | SimpleFooter['links'],
): links is MultiColumnFooter['links'] {
  return 'title' in links[0]!;
}
