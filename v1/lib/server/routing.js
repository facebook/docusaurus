/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {DOCS_URL} = require('../core/constants');

function blog(baseUrl) {
  return new RegExp(`^${baseUrl}blog/.*html$`);
}

function docs(baseUrl, docsUrl) {
  return new RegExp(`^${baseUrl}${docsUrl}/.*html$`);
}

function dotfiles() {
  return /(?!.*html$)^\/.*\.[^\n/]+$/;
}

function feed(baseUrl) {
  return new RegExp(`^${baseUrl}blog/(feed.xml|atom.xml)$`);
}

function noExtension() {
  return /\/[^.]*\/?$/;
}

function page(baseUrl, docsUrl) {
  const gr = regex => regex.toString().replace(/(^\/|\/$)/gm, '');
  return new RegExp(
    `(?!${gr(docs(baseUrl, docsUrl))}|${gr(
      blog(baseUrl)
    )})^${baseUrl}.*.html$`
  );
}

function sitemap(baseUrl) {
  return new RegExp(`^${baseUrl}sitemap.xml$`);
}

function getDocsUrl(docsUrl) {
  return docsUrl || DOCS_URL;
}

module.exports = {
  blog,
  docs,
  dotfiles,
  feed,
  page,
  noExtension,
  sitemap,
  getDocsUrl,
};
