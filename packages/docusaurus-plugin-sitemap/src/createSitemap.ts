/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactElement} from 'react';
import {matchRoutes, type RouteConfig as RRRouteConfig} from 'react-router-config';
import {SitemapStream, streamToPromise} from 'sitemap';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import {createMatcher} from '@docusaurus/utils';
import type {DocusaurusConfig} from '@docusaurus/types';
import type {RouteConfig} from '@docusaurus/types/src/routing';
import type {HelmetServerState} from 'react-helmet-async';
import type {PluginOptions} from './options';

function isNoIndexMetaRoute({
  head,
  route,
}: {
  head: {[location: string]: HelmetServerState};
  route: string;
}) {
  const isNoIndexMetaTag = ({
    name,
    content,
  }: {
    name?: string;
    content?: string;
  }): boolean => {
    if (!name || !content) {
      return false;
    }
    return (
      // meta name is not case-sensitive
      name.toLowerCase() === 'robots' &&
      // Robots directives are not case-sensitive
      content.toLowerCase().includes('noindex')
    );
  };

  // https://github.com/staylor/react-helmet-async/pull/167
  const meta = head[route]?.meta.toComponent() as unknown as
    | ReactElement<{name?: string; content?: string}>[]
    | undefined;
  return meta?.some((tag) =>
    isNoIndexMetaTag({name: tag.props.name, content: tag.props.content}),
  );
}

export default async function createSitemap(
  siteConfig: DocusaurusConfig,
  routesPaths: string[],
  routes: RouteConfig[],
  head: {[location: string]: HelmetServerState},
  options: PluginOptions,
): Promise<string | null> {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('URL in docusaurus.config.js cannot be empty/undefined.');
  }
  const {changefreq, priority, ignorePatterns} = options;

  const ignoreMatcher = createMatcher(ignorePatterns);

  function isRouteExcluded(route: string) {
    return (
      route.endsWith('404.html') ||
      ignoreMatcher(route) ||
      isNoIndexMetaRoute({head, route})
    );
  }

  const includedRoutes = routesPaths.filter((route) => !isRouteExcluded(route));

  if (includedRoutes.length === 0) {
    return null;
  }

  function mapRoute(route: RouteConfig) : RRRouteConfig {
    const { component, routes: originalRoutes, ...rrRoute } = route;
    return { routes: originalRoutes?.map(mapRoute), ...rrRoute };
  }

  const sitemapStream = new SitemapStream({hostname, lastmodDateOnly: options.lastmod === 'date'});
  const rrRoutes: RRRouteConfig[] = routes.map(mapRoute);

  includedRoutes.forEach((routePath) => {
    sitemapStream.write({
      url: applyTrailingSlash(routePath, {
        trailingSlash: siteConfig.trailingSlash,
        baseUrl: siteConfig.baseUrl,
      }),
      changefreq,
      priority,
      lastmod:
        routes !== undefined && options.lastmod !== false
          ? matchRoutes(rrRoutes, routePath).find(
            ({route}) => route?.exact === true,
          )?.route?.lastModified
          : undefined,
    });
  });

  sitemapStream.end();

  const generatedSitemap = (await streamToPromise(sitemapStream)).toString();

  return generatedSitemap;
}
