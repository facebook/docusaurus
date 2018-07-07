/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function blogRouting(baseUrl) {
  return new RegExp(`^${baseUrl}blog/.*html$`);
}

function docsRouting(baseUrl) {
  return new RegExp(`^${baseUrl}docs/.*html$`);
}

function dotRouting() {
  return /(?!.*html$)^\/.*\.[^\n/]+$/;
}

function feedRouting(baseUrl) {
  return new RegExp(`^${baseUrl}blog/(feed.xml|atom.xml)$`);
}

function noExtRouting() {
  return /\/[^.]*\/?$/;
}

function pageRouting(baseUrl) {
  const gr = regex => regex.toString().replace(/(^\/|\/$)/gm, '');
  return new RegExp(
    `(?!${gr(docsRouting(baseUrl))}|${gr(
      blogRouting(baseUrl)
    )})^${baseUrl}.*.html$`
  );
}

function sitemapRouting(baseUrl) {
  return new RegExp(`^${baseUrl}sitemap.xml$`);
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
