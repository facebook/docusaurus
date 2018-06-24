/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const escape = require('escape-string-regexp');

function blogRouting(baseUrl) {
  return new RegExp(`^${escape(baseUrl)}blog\/.*html$`);
}

function docsRouting(baseUrl) {
  return new RegExp(`^${escape(baseUrl)}docs\/.*html$`);
}

function feedRouting(baseUrl) {
  return new RegExp(`^${escape(baseUrl)}blog\/(feed\.xml|atom\.xml)`);
}

function pageRouting(baseUrl) {
  return new RegExp(
    `(?!^${escape(baseUrl)}docs\/.*html$|^${escape(baseUrl)}blog\/.*html$)` +
    `^${escape(baseUrl)}.*\.html$`
  );
}

function sitemapRouting(baseUrl) {
  return new RegExp(`^${escape(baseUrl)}sitemap.xml`);
}

module.exports = {
  blogRouting,
  docsRouting,
  feedRouting,
  pageRouting,
  sitemapRouting,
};
