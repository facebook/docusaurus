/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const sitemap = require('sitemap');

module.exports = async function createSitemap({
  siteConfig = {},
  docsMetadatas = {},
  pagesMetadatas = [],
  blogMetadatas = [],
}) {
  const allMetadatas = [
    ...blogMetadatas,
    ...Object.values(docsMetadatas),
    ...pagesMetadatas,
  ];

  const {url: siteUrl} = siteConfig;

  if (!siteUrl) {
    throw new Error('Url in siteConfig.js cannot be empty/undefined');
  }

  const urls = [];

  allMetadatas.forEach(metadata => {
    urls.push({
      url: metadata.permalink,
      changefreq: 'weekly',
      priority: 0.5,
    });
  });

  const sm = sitemap.createSitemap({
    hostname: siteUrl,
    cacheTime: 600 * 1000, // 600 sec - cache purge period
    urls,
  });

  return sm.toString();
};
