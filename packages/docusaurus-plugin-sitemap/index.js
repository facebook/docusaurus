/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const sitemap = require('sitemap');
const path = require('path');

const DEFAULT_OPTIONS = {
  cacheTime: 600 * 1000, // 600 sec - cache purge period
  changefreq: 'weekly',
  priority: 0.5,
};

class DocusaurusPluginSitemap {
  constructor(opts, context) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
  }

  getName() {
    return 'docusaurus-plugin-sitemap';
  }

  async createSitemap({siteConfig = {}, routesPaths}) {
    const {url: hostname} = siteConfig;
    if (!hostname) {
      throw new Error(`Url in docusaurus.config.js cannot be empty/undefined`);
    }

    const urls = routesPaths.map(routesPath => ({
      url: routesPath,
      changefreq: this.changefreq,
      priority: this.priority,
    }));

    return sitemap
      .createSitemap({
        hostname,
        cacheTime: this.cacheTime,
        urls,
      })
      .toString();
  }

  async postBuild({siteConfig = {}, routesPaths = [], outDir}) {
    // Generate sitemap
    const generatedSitemap = await this.createSitemap({
      siteConfig,
      routesPaths,
    });

    // Write sitemap file
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    return fs.writeFile(sitemapPath, generatedSitemap);
  }
}

module.exports = DocusaurusPluginSitemap;
