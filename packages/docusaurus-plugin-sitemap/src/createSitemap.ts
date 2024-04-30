/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactElement} from 'react';
import {createMatcher, flattenRoutes} from '@docusaurus/utils';
import {sitemapItemsToXmlString} from './xml';
import {createSitemapItem} from './createSitemapItem';
import type {SitemapItem, DefaultCreateSitemapParams} from './types';
import type {DocusaurusConfig, RouteConfig} from '@docusaurus/types';
import type {HelmetServerState} from 'react-helmet-async';

// Maybe we want to add a routeConfig.metadata.noIndex instead?
// But using Helmet is more reliable for third-party plugins...
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

// Not all routes should appear in the sitemap, and we should filter:
// - parent routes, used for layouts
// - routes matching options.ignorePatterns
// - routes with no index metadata
function getSitemapRoutes({routes, head, options}: DefaultCreateSitemapParams) {
  const {ignorePatterns} = options;

  const ignoreMatcher = createMatcher(ignorePatterns);

  function isRouteExcluded(route: RouteConfig) {
    return (
      ignoreMatcher(route.path) || isNoIndexMetaRoute({head, route: route.path})
    );
  }

  return flattenRoutes(routes).filter((route) => !isRouteExcluded(route));
}

async function defaultCreateSitemapItems(
  params: DefaultCreateSitemapParams,
): Promise<SitemapItem[]> {
  const sitemapRoutes = getSitemapRoutes(params);
  if (sitemapRoutes.length === 0) {
    return [];
  }
  return Promise.all(
    sitemapRoutes.map((route) =>
      createSitemapItem({
        route,
        siteConfig: params.siteConfig,
        options: params.options,
      }),
    ),
  );
}

export default async function createSitemap(
  params: DefaultCreateSitemapParams,
): Promise<string | null> {
  const {head, options, routes, siteConfig} = params;

  const sitemapItems = params.options.createSitemapItems
    ? await params.options.createSitemapItems({
        routes,
        siteConfig,
        defaultCreateSitemapItems: (userParams: {
          routes: RouteConfig[];
          siteConfig: DocusaurusConfig;
        }) =>
          defaultCreateSitemapItems({
            head,
            options,
            ...userParams,
          }),
      })
    : await defaultCreateSitemapItems({
        head,
        options,
        routes,
        siteConfig,
      });

  if (sitemapItems.length === 0) {
    return null;
  }

  const xmlString = await sitemapItemsToXmlString(sitemapItems, {
    lastmod: params.options.lastmod,
  });
  return xmlString;
}
