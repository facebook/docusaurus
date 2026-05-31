/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {applyTrailingSlash} from '@docusaurus/utils-common';
import type {DocusaurusConfig} from '@docusaurus/types';

// Builds an absolute URL for a blog permalink, respecting the site's
// trailingSlash config so the structured data matches the canonical page URL.
export function getAbsoluteUrl(
  permalink: string,
  siteConfig: Pick<DocusaurusConfig, 'url' | 'baseUrl' | 'trailingSlash'>,
): string {
  const pathname = applyTrailingSlash(permalink, {
    trailingSlash: siteConfig.trailingSlash,
    baseUrl: siteConfig.baseUrl,
  });
  return `${siteConfig.url}${pathname}`;
}
