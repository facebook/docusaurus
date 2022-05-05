/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SitemapStream, streamToPromise} from 'sitemap';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import {createMatcher} from '@docusaurus/utils';
import type {DocusaurusConfig} from '@docusaurus/types';
import type {HelmetServerState} from 'react-helmet-async';
import type {PluginOptions} from './options';
import type {ReactElement} from 'react';

export default async function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  head: {[location: string]: HelmetServerState},
  options: PluginOptions,
): Promise<string> {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('URL in docusaurus.config.js cannot be empty/undefined.');
  }
  const {changefreq, priority, ignorePatterns} = options;

  const ignoreMatcher = createMatcher(ignorePatterns);

  const sitemapStream = new SitemapStream({hostname});

  function routeShouldBeIncluded(route: string) {
    if (route.endsWith('404.html') || ignoreMatcher(route)) {
      return false;
    }
    // https://github.com/staylor/react-helmet-async/pull/167
    const meta = head[route]?.meta.toComponent() as unknown as
      | ReactElement[]
      | undefined;
    return !meta?.some(
      (tag) => tag.props.name === 'robots' && tag.props.content === 'noindex',
    );
  }

  routesPaths.filter(routeShouldBeIncluded).forEach((routePath) =>
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
