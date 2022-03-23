/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Formats the page's title based on relevant site config and other contexts.
 */
export function useTitleFormatter(title?: string | undefined): string {
  const {siteConfig} = useDocusaurusContext();
  const {title: siteTitle, titleDelimiter} = siteConfig;
  return title?.trim().length
    ? `${title.trim()} ${titleDelimiter} ${siteTitle}`
    : siteTitle;
}
