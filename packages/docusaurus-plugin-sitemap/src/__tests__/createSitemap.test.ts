/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createSitemap from '../createSitemap';
import {DocusaurusConfig} from '@docusaurus/types';

describe('createSitemap', () => {
  test('simple site', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      ['/', '/test'],
      {
        changefreq: 'daily',
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
    }).rejects.toThrow('url in docusaurus.config.js cannot be empty/undefined');
  });

  test('exclusion of 404 page', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      ['/', '/404.html', '/mypage'],
      {
        changefreq: 'daily',
        priority: 0.7,
        trailingSlash: false,
      },
    );
    expect(sitemap).not.toContain('404');
  });

  test('add trailing slash', async () => {
    const sitemap = await createSitemap(
      {
        url: 'https://example.com',
      } as DocusaurusConfig,
      ['/', '/test'],
      {
        changefreq: 'daily',
        priority: 0.7,
        trailingSlash: true,
      },
    );

    expect(sitemap).toContain('<loc>https://example.com/test/</loc>');
    expect(sitemap).not.toContain('<loc>https://example.com/test</loc>');
  });
});
