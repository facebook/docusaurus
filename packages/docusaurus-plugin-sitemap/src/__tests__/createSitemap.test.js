/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createSitemap from '../createSitemap';

describe('createSitemap', () => {
  test('simple site', () => {
    const sitemap = createSitemap({
      siteConfig: {
        url: 'https://example.com',
      },
      routesPaths: ['/', '/test'],
    });
    expect(sitemap).toContain(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`,
    );
  });

  test('empty site', () => {
    expect(() => {
      createSitemap({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"Url in docusaurus.config.js cannot be empty/undefined"`,
    );
  });
});
