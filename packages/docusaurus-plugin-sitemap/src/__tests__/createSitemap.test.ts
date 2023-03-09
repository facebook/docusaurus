/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {EnumChangefreq} from 'sitemap';
import createSitemap from '../createSitemap';
import type {PluginOptions} from '../options';
import type {DocusaurusConfig} from '@docusaurus/types';

describe('createSitemap', () => {
  it('simple site', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/test' }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
        filename: 'sitemap.xml',
      },
    );
    expect(sitemap).toContain(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`,
    );
  });

  it('empty site', () =>
    expect(async () => {
      // @ts-expect-error: test
      await createSitemap({}, [], {}, {} as PluginOptions);
    }).rejects.toThrow(
      'URL in docusaurus.config.js cannot be empty/undefined.',
    ));

  it('exclusion of 404 page', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/404.html' }, { path: '/my-page' }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
        filename: 'sitemap.xml',
      },
    );
    expect(sitemap).not.toContain('404');
  });

  it('excludes patterns configured to be ignored', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/search/' }, { path: '/tags/' }, { path: '/search/foo' }, { path: '/tags/foo/bar' }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [
          // Shallow ignore
          '/search/',
          // Deep ignore
          '/tags/**',
        ],
        filename: 'sitemap.xml',
      },
    );
    expect(sitemap).not.toContain('/search/</loc>');
    expect(sitemap).toContain('/search/foo');
    expect(sitemap).not.toContain('/tags');
  });

  it('keep trailing slash unchanged', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: undefined,
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/test' }, { path: '/nested/test' }, { path: '/nested/test2/' }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
        filename: 'sitemap.xml',
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });

  it('add trailing slash', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: true,
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/test' }, { path: '/nested/test' }, { path: '/nested/test2/' }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
        filename: 'sitemap.xml',
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });

  it('remove trailing slash', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: false,
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/test' }, { path: '/nested/test' }, { path: '/nested/test2/' }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
        filename: 'sitemap.xml',
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2</loc>');
  });

  it('site with nested pages in routes', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      [{ path: '/', routes: [{ path: '/test', routes: [{ path: '/test/nested' }] }] }],
      {},
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
        filename: 'sitemap.xml',
      },
    );
    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test/nested</loc>');
  });

  it('filters pages with noindex', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: false,
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/noindex' }, { path: '/nested/test' }, { path: '/nested/test2/' }],
      {
        '/noindex': {
          meta: {
            // @ts-expect-error: bad lib def
            toComponent: () => [
              React.createElement('meta', {
                name: 'robots',
                content: 'NoFolloW, NoiNDeX',
              }),
            ],
          },
        },
      },
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
      },
    );

    expect(sitemap).not.toContain('/noindex');
  });

  it('does not generate anything for all pages with noindex', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: false,
      } as DocusaurusConfig,
      [{ path: '/' }, { path: '/noindex' }],
      {
        '/': {
          meta: {
            // @ts-expect-error: bad lib def
            toComponent: () => [
              React.createElement('meta', {name: 'robots', content: 'noindex'}),
            ],
          },
        },
        '/noindex': {
          meta: {
            // @ts-expect-error: bad lib def
            toComponent: () => [
              React.createElement('meta', {name: 'robots', content: 'noindex'}),
            ],
          },
        },
      },
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        ignorePatterns: [],
      },
    );

    expect(sitemap).toBeNull();
  });
});
