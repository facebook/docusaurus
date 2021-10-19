/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createSitemap from '../createSitemap';
import {DocusaurusConfig} from '@docusaurus/types';
import {EnumChangefreq} from 'sitemap';

describe('createSitemap', () => {
  test('simple site', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      ['/', '/test'],
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        trailingSlash: false,
      },
    );
    expect(sitemap).toContain(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`,
    );
  });

  test('empty site', () => {
    return expect(async () => {
      await createSitemap({} as DocusaurusConfig, [], {});
    }).rejects.toThrow(
      'URL in docusaurus.config.js cannot be empty/undefined.',
    );
  });

  test('exclusion of 404 page', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      ['/', '/404.html', '/mypage'],
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        trailingSlash: false,
      },
    );
    expect(sitemap).not.toContain('404');
  });

  test('keep trailing slash unchanged', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: undefined,
      } as DocusaurusConfig,
      ['/', '/test', '/nested/test', '/nested/test2/'],
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });

  test('add trailing slash', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: true,
      } as DocusaurusConfig,
      ['/', '/test', '/nested/test', '/nested/test2/'],
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });

  test('remove trailing slash', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
        trailingSlash: false,
      } as DocusaurusConfig,
      ['/', '/test', '/nested/test', '/nested/test2/'],
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2</loc>');
  });

  test('add trailing slash (deprecated plugin option)', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      ['/', '/test', '/nested/test', '/nested/test2/'],
      {
        changefreq: EnumChangefreq.DAILY,
        priority: 0.7,
        trailingSlash: true,
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/nested/test2/</loc>');
  });
});
