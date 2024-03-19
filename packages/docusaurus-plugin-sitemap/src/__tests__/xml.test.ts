/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {sitemapItemsToXmlString} from '../xml';

describe('createSitemap', () => {
  it('no items', async () => {
    await expect(
      sitemapItemsToXmlString([]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Can't generate a sitemap with no items"`,
    );
  });

  it('simple item', async () => {
    await expect(
      sitemapItemsToXmlString([{url: 'https://docusaurus.io/docs/doc1'}]),
    ).resolves.toMatchInlineSnapshot(
      `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>https://docusaurus.io/docs/doc1</loc></url></urlset>"`,
    );
  });

  it('complex item', async () => {
    await expect(
      sitemapItemsToXmlString([
        {
          url: 'https://docusaurus.io/docs/doc1',
          changefreq: 'always',
          priority: 1,
          lastmod: new Date('01/01/2024').toISOString(),
        },
      ]),
    ).resolves.toMatchInlineSnapshot(
      `"<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>https://docusaurus.io/docs/doc1</loc><lastmod>2024-01-01T00:00:00.000Z</lastmod><changefreq>always</changefreq><priority>1.0</priority></url></urlset>"`,
    );
  });
});
