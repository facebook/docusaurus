/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sitemap, {SitemapItemOptions} from 'sitemap';
import {DocusaurusConfig} from '@docusaurus/types';
import {PluginOptions} from './types';

export default function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  options: PluginOptions,
) {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('Url in docusaurus.config.js cannot be empty/undefined');
  }

  const urls = routesPaths.map(
    routesPath =>
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
