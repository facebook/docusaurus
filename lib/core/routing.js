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

function dotRouting() {
  return /(?!.*html$)^\/.*\.[^\n\/]+$/;
}

function feedRouting(baseUrl) {
  return new RegExp(`^${escape(baseUrl)}blog\/(feed\.xml|atom\.xml)$`);
}

function noExtRouting() {
  return /\/[^\.]*\/?$/;
}

function pageRouting(baseUrl) {
  const gr = regex => regex.toString().replace(/(^\/|\/$)/gm, '');
  return new RegExp(
    `(?!${gr(docsRouting(baseUrl))}|${gr(blogRouting(baseUrl))})^${escape(
      baseUrl
    )}.*\.html$`
  );
}

function sitemapRouting(baseUrl) {
  return new RegExp(`^${escape(baseUrl)}sitemap.xml$`);
}

module.exports = {
  blogRouting,
  docsRouting,
  dotRouting,
  feedRouting,
  pageRouting,
  noExtRouting,
  sitemapRouting,
};
