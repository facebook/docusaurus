/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fromPartial} from '@total-typescript/shoehorn';
import createSitemap from '../createSitemap';
import type {PluginOptions} from '../options';
import type {DocusaurusConfig, RouteConfig} from '@docusaurus/types';

const siteConfig: DocusaurusConfig = fromPartial({
  url: 'https://example.com',
});

const options: PluginOptions = {
  changefreq: 'daily',
  priority: 0.7,
  ignorePatterns: [],
  filename: 'sitemap.xml',
  lastmod: 'datetime',
};

const route = (routePath: string, routePaths?: string[]): RouteConfig => {
  return fromPartial({
    path: routePath,
    routes: routePaths?.map((p) => route(p)),
  });
};

const routes = (routePaths: string[]): RouteConfig[] => {
  return routePaths.map((p) => route(p));
};

describe('createSitemap', () => {
  it('simple site', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes(['/', '/test']),
      routesBuildMetadata: {},
      options,
    });
    expect(sitemap).toContain(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`,
    );
  });

  it('site with no routes', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes([]),
      routesBuildMetadata: {},
      options,
    });
    expect(sitemap).toBeNull();
  });

  it('excludes patterns configured to be ignored', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes([
        '/',
        '/search/',
        '/tags/',
        '/search/foo',
        '/tags/foo/bar',
      ]),
      routesBuildMetadata: {},
      options: {
        ...options,
        ignorePatterns: [
          // Shallow ignore
          '/search/',
          // Deep ignore
          '/tags/**',
        ],
      },
    });

    expect(sitemap).not.toContain('/search/</loc>');
    expect(sitemap).toContain('/search/foo');
    expect(sitemap).not.toContain('/tags');
  });

  it('excludes items that createSitemapItems configures to be ignored', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes([
        '/',
        '/search/',
        '/tags/',
        '/search/foo',
        '/tags/foo/bar',
      ]),
      routesBuildMetadata: {},
      options: {
        ...options,
        createSitemapItems: async (params) => {
          const {defaultCreateSitemapItems, ...rest} = params;
          const sitemapItems = await defaultCreateSitemapItems(rest);
          const sitemapsWithoutPageAndTags = sitemapItems.filter(
            (sitemapItem) =>
              !sitemapItem.url.includes('/tags/') &&
              !sitemapItem.url.endsWith('/search/'),
          );
          return sitemapsWithoutPageAndTags;
        },
      },
    });

    expect(sitemap).not.toContain('/search/</loc>');
    expect(sitemap).toContain('/search/foo');
    expect(sitemap).not.toContain('/tags');
  });

  it('returns null when createSitemapItems returns no items', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes(['/', '/docs/myDoc/', '/blog/post']),
      routesBuildMetadata: {},
      options: {
        ...options,
        createSitemapItems: async () => {
          return [];
        },
      },
    });

    expect(sitemap).toBeNull();
  });

  it('keep trailing slash unchanged', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes(['/', '/test', '/nested/test', '/nested/test2/']),
      routesBuildMetadata: {},
      options,
    });

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });

  it('add trailing slash', async () => {
    const sitemap = await createSitemap({
      siteConfig: {...siteConfig, trailingSlash: true},
      routes: routes(['/', '/test', '/nested/test', '/nested/test2/']),
      routesBuildMetadata: {},
      options,
    });

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });

  it('remove trailing slash', async () => {
    const sitemap = await createSitemap({
      siteConfig: {
        ...siteConfig,
        url: 'https://example.com',
        trailingSlash: false,
      },
      routes: routes(['/', '/test', '/nested/test', '/nested/test2/']),
      routesBuildMetadata: {},
      options,
    });

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2</loc>');
  });

  it('filters pages with noindex', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes(['/', '/noindex', '/nested/test', '/nested/test2/']),
      routesBuildMetadata: {
        '/noindex': {
          noIndex: true,
        },
      },
      options,
    });

    expect(sitemap).not.toContain('/noindex');
  });

  it('does not generate anything for all pages with noindex', async () => {
    const sitemap = await createSitemap({
      siteConfig,
      routes: routes(['/', '/noindex']),
      routesBuildMetadata: {
        '/': {
          noIndex: true,
        },
        '/noindex': {
          noIndex: true,
        },
      },
      options,
    });

    expect(sitemap).toBeNull();
  });
});
