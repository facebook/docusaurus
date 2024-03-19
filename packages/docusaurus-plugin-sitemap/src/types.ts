/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// types are according to the sitemap spec:
// see also https://www.sitemaps.org/protocol.html

export type ChangeFred =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'always'
  | 'never';

// We re-recreate our own type because the "sitemap" lib types are not good
export type SitemapItem = {
  /**
   * URL of the page.
   * This URL must begin with the protocol (such as http).
   * It should eventually end with a trailing slash.
   * It should be less than 2,048 characters.
   */
  url: string;

  /**
   * ISO 8601 date string.
   * See also https://www.w3.org/TR/NOTE-datetime
   *
   * It is recommended to use one of:
   * - date.toISOString()
   * - YYYY-MM-DD
   *
   * Note: as of 2024, Google uses this value for crawling priority.
   * See also https://github.com/facebook/docusaurus/issues/2604
   */
  lastmod?: string;

  /**
   * One of the specified enum values
   *
   * Note: as of 2024, Google ignores this value.
   * See also https://github.com/facebook/docusaurus/issues/2604
   */
  changefreq?: ChangeFred;

  /**
   * The priority of this URL relative to other URLs on your site.
   * Valid values range from 0.0 to 1.0.
   * The default priority of a page is 0.5.
   *
   * Note: as of 2024, Google ignores this value.
   * See also https://github.com/facebook/docusaurus/issues/2604
   */
  priority?: number;
};
