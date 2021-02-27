/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SitemapStream, streamToPromise} from 'sitemap';
import {PluginOptions} from './types';
import {DocusaurusConfig} from '@docusaurus/types';
import {addTrailingSlash} from '@docusaurus/utils';

export default async function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  options: PluginOptions,
): Promise<string> {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('url in docusaurus.config.js cannot be empty/undefined');
  }
  const {changefreq, priority, trailingSlash} = options;

  const sitemapStream = new SitemapStream({
    hostname,
  });

  routesPaths
    .filter((route) => !route.endsWith('404.html'))
    .map((routePath) =>
      sitemapStream.write({
        url: trailingSlash ? addTrailingSlash(routePath) : routePath,
        changefreq,
        priority,
      }),
    );

  sitemapStream.end();

  const generatedSitemap = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString(),
  );

  return generatedSitemap;
}
