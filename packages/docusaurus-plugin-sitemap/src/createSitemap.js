/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const sitemap = require('sitemap');

module.exports = function createSitemap({
  siteConfig = {},
  routesPaths,
  options = {},
}) {
  const {url: hostname} = siteConfig;
  if (!hostname) {
    throw new Error('Url in docusaurus.config.js cannot be empty/undefined');
  }

  const urls = routesPaths.map(routesPath => ({
    url: routesPath,
    changefreq: options.changefreq,
    priority: options.priority,
  }));

  return sitemap
    .createSitemap({
      hostname,
      cacheTime: options.cacheTime,
      urls,
    })
    .toString();
};
