/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {applyTrailingSlash} from '@docusaurus/utils-common';
import type {DocusaurusConfig} from '@docusaurus/types';

/**
 * Builds an absolute URL for structured data, applying the site's
 * `trailingSlash` config so it matches the actual page URL.
 *
 * @see https://github.com/facebook/docusaurus/issues/10755
 */
export function getAbsoluteUrl(
  permalink: string,
  siteConfig: DocusaurusConfig,
): string {
  return `${siteConfig.url}${applyTrailingSlash(permalink, {
    trailingSlash: siteConfig.trailingSlash,
    baseUrl: siteConfig.baseUrl,
  })}`;
}
