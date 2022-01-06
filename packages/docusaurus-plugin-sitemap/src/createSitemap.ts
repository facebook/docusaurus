/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SitemapStream, streamToPromise} from 'sitemap';
import type {Options} from '@docusaurus/plugin-sitemap';
import type {DocusaurusConfig} from '@docusaurus/types';
import {applyTrailingSlash} from '@docusaurus/utils-common';

export default async function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  options: Options,
): Promise<string> {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('URL in docusaurus.config.js cannot be empty/undefined.');
  }
  const {changefreq, priority} = options;

  const sitemapStream = new SitemapStream({hostname});

  routesPaths
    .filter((route) => !route.endsWith('404.html'))
    .forEach((routePath) =>
      sitemapStream.write({
        url: applyTrailingSlash(routePath, {
          trailingSlash: siteConfig.trailingSlash,
          baseUrl: siteConfig.baseUrl,
        }),
        changefreq,
        priority,
      }),
    );

  sitemapStream.end();

  const generatedSitemap = (await streamToPromise(sitemapStream)).toString();

  return generatedSitemap;
}
