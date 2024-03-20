/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {applyTrailingSlash} from '@docusaurus/utils-common';
import {getLastUpdate, normalizeUrl} from '@docusaurus/utils';
import type {LastModOption, SitemapItem} from './types';
import type {DocusaurusConfig, RouteConfig} from '@docusaurus/types';
import type {PluginOptions} from './options';

async function getRouteLastUpdatedAt(
  route: RouteConfig,
): Promise<number | undefined> {
  if (route.metadata?.lastUpdatedAt) {
    return route.metadata?.lastUpdatedAt;
  }
  if (route.metadata?.sourceFilePath) {
    const lastUpdate = await getLastUpdate(route.metadata?.sourceFilePath);
    return lastUpdate?.lastUpdatedAt;
  }

  return undefined;
}

type LastModFormatter = (timestamp: number) => string;

const LastmodFormatters: Record<LastModOption, LastModFormatter> = {
  date: (timestamp) => new Date(timestamp).toISOString().split('T')[0]!,
  datetime: (timestamp) => new Date(timestamp).toISOString(),
};

function formatLastmod(timestamp: number, lastmodOption: LastModOption) {
  const format = LastmodFormatters[lastmodOption];
  return format(timestamp);
}

async function getRouteLastmod({
  route,
  lastmod,
}: {
  route: RouteConfig;
  lastmod: LastModOption | null;
}): Promise<string | null> {
  if (lastmod === null) {
    return null;
  }
  const lastUpdatedAt = (await getRouteLastUpdatedAt(route)) ?? null;
  return lastUpdatedAt ? formatLastmod(lastUpdatedAt, lastmod) : null;
}

export async function createSitemapItem({
  route,
  siteConfig,
  options,
}: {
  route: RouteConfig;
  siteConfig: DocusaurusConfig;
  options: PluginOptions;
}): Promise<SitemapItem> {
  const {changefreq, priority, lastmod} = options;
  return {
    url: normalizeUrl([
      siteConfig.url,
      applyTrailingSlash(route.path, {
        trailingSlash: siteConfig.trailingSlash,
        baseUrl: siteConfig.baseUrl,
      }),
    ]),
    changefreq,
    priority,
    lastmod: await getRouteLastmod({route, lastmod}),
  };
}
