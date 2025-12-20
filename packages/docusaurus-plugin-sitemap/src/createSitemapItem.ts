/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {applyTrailingSlash} from '@docusaurus/utils-common';
import {normalizeUrl} from '@docusaurus/utils';
import type {LastModOption, SitemapItem} from './types';
import type {DocusaurusConfig, RouteConfig, VcsConfig} from '@docusaurus/types';
import type {PluginOptions} from './options';

async function getRouteLastUpdatedAt(
  route: RouteConfig,
  vcs: Pick<VcsConfig, 'getFileLastUpdateInfo'>,
): Promise<number | null | undefined> {
  // Important to bail-out early here
  // This can lead to duplicated VCS calls and performance problems
  // See https://github.com/facebook/docusaurus/pull/11211
  if (route.metadata?.lastUpdatedAt === null) {
    return null;
  }
  if (route.metadata?.lastUpdatedAt) {
    return route.metadata?.lastUpdatedAt;
  }
  if (route.metadata?.sourceFilePath) {
    const lastUpdateInfo = await vcs.getFileLastUpdateInfo(
      route.metadata?.sourceFilePath,
    );
    return lastUpdateInfo?.timestamp ?? null;
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
  vcs,
}: {
  route: RouteConfig;
  lastmod: LastModOption | null;
  vcs: Pick<VcsConfig, 'getFileLastUpdateInfo'>;
}): Promise<string | null> {
  if (lastmod === null) {
    return null;
  }
  const lastUpdatedAt = (await getRouteLastUpdatedAt(route, vcs)) ?? null;
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
    lastmod: await getRouteLastmod({
      route,
      lastmod,
      vcs: siteConfig.future.experimental_vcs,
    }),
  };
}
