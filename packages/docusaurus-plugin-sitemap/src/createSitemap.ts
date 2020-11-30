/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sitemap, {Sitemap, SitemapItemOptions} from 'sitemap';
import {PluginOptions} from './types';
import {DocusaurusConfig} from '@docusaurus/types';

export default function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  options: PluginOptions,
): Sitemap {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('url in docusaurus.config.js cannot be empty/undefined');
  }
  const {cacheTime, changefreq, priority, trailingSlash} = options;

  const urls = routesPaths
    .filter((route) => !route.endsWith('404.html'))
    .map(
      (routesPath): SitemapItemOptions => ({
        url: `${routesPath}${trailingSlash && routesPath !== '/' ? '/' : ''}`,
        changefreq,
        priority,
      }),
    );

  return sitemap.createSitemap({
    hostname,
    cacheTime,
    urls,
  });
}
