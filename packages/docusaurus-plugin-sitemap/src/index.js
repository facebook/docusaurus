/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');

const createSitemap = require('./createSitemap');

const DEFAULT_OPTIONS = {
  cacheTime: 600 * 1000, // 600 sec - cache purge period
  changefreq: 'weekly',
  priority: 0.5,
};

module.exports = function(context, opts) {
  const options = {...DEFAULT_OPTIONS, ...opts};

  return {
    name: 'docusaurus-plugin-sitemap',

    async postBuild({siteConfig = {}, routesPaths = [], outDir}) {
      // Generate sitemap
      const generatedSitemap = createSitemap({
        siteConfig,
        routesPaths,
        options,
      }).toString();

      // Write sitemap file
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      fs.writeFile(sitemapPath, generatedSitemap, err => {
        if (err) {
          throw new Error(`Sitemap error: ${err}`);
        }
      });
    },
  };
};
