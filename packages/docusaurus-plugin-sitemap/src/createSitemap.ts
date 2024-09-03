/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createMatcher, flattenRoutes} from '@docusaurus/utils';
import {sitemapItemsToXmlString} from './xml';
import {createSitemapItem} from './createSitemapItem';
import {isNoIndexMetaRoute} from './head';
import type {CreateSitemapItemsFn, CreateSitemapItemsParams} from './types';
import type {RouteConfig} from '@docusaurus/types';
import type {PluginOptions} from './options';
import type {HelmetServerState} from 'react-helmet-async';

// Not all routes should appear in the sitemap, and we should filter:
// - parent routes, used for layouts
// - routes matching options.ignorePatterns
// - routes with no index metadata
function getSitemapRoutes({routes, head, options}: CreateSitemapParams) {
  const {ignorePatterns} = options;

  const ignoreMatcher = createMatcher(ignorePatterns);

  function isRouteExcluded(route: RouteConfig) {
    return (
      ignoreMatcher(route.path) || isNoIndexMetaRoute({head, route: route.path})
    );
  }

  return flattenRoutes(routes).filter((route) => !isRouteExcluded(route));
}

// Our default implementation receives some additional parameters on purpose
// Params such as "head" are "messy" and not directly exposed to the user
function createDefaultCreateSitemapItems(
  internalParams: Pick<CreateSitemapParams, 'head' | 'options'>,
): CreateSitemapItemsFn {
  return async (params) => {
    const sitemapRoutes = getSitemapRoutes({...params, ...internalParams});
    if (sitemapRoutes.length === 0) {
      return [];
    }
    return Promise.all(
      sitemapRoutes.map((route) =>
        createSitemapItem({
          route,
          siteConfig: params.siteConfig,
          options: internalParams.options,
        }),
      ),
    );
  };
}

type CreateSitemapParams = CreateSitemapItemsParams & {
  head: {[location: string]: HelmetServerState};
  options: PluginOptions;
};

export default async function createSitemap(
  params: CreateSitemapParams,
): Promise<string | null> {
  const {head, options, routes, siteConfig} = params;

  const defaultCreateSitemapItems: CreateSitemapItemsFn =
    createDefaultCreateSitemapItems({head, options});

  const sitemapItems = params.options.createSitemapItems
    ? await params.options.createSitemapItems({
        routes,
        siteConfig,
        defaultCreateSitemapItems,
      })
    : await defaultCreateSitemapItems({
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
