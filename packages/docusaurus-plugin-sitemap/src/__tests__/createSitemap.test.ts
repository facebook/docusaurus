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
      ['/', '/test'],
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
      ['/', '/404.html', '/my-page'],
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
      ['/', '/search/', '/tags/', '/search/foo', '/tags/foo/bar'],
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
      ['/', '/test', '/nested/test', '/nested/test2/'],
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
      ['/', '/test', '/nested/test', '/nested/test2/'],
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
      ['/', '/test', '/nested/test', '/nested/test2/'],
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

  it('filters pages with noindex', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: false,
      } as DocusaurusConfig,
      ['/', '/noindex', '/nested/test', '/nested/test2/'],
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
      ['/', '/noindex'],
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
