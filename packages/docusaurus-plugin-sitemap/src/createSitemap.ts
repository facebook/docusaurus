/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sitemap, {SitemapItemOptions} from 'sitemap';
import {PluginOptions} from './types';
import {DocusaurusConfig} from '@docusaurus/types';

export default function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  options: PluginOptions,
) {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('url in docusaurus.config.js cannot be empty/undefined');
  }

  let finalizedRoutesPaths: string[] = [];
  // filter through routes to exclude the 404 page
  routesPaths.forEach((route: string) => {
    if (route.indexOf('404') === -1) {
      finalizedRoutesPaths.push(route);
    }
  });

  const urls = finalizedRoutesPaths.map(
    (routesPath) =>
      ({
        url: routesPath,
        changefreq: options.changefreq,
        priority: options.priority,
      } as SitemapItemOptions),
  );

  return sitemap.createSitemap({
    hostname,
    cacheTime: options.cacheTime,
    urls,
  });
}
