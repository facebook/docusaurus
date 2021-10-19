/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function blog(siteConfig) {
  return new RegExp(`^${siteConfig.baseUrl}blog/.*html$`);
}

function docs(siteConfig) {
  const docsPart = `${siteConfig.docsUrl ? `${siteConfig.docsUrl}/` : ''}`;
  return new RegExp(`^${siteConfig.baseUrl}${docsPart}.*html$`);
}

function dotfiles() {
  return /(?!.*html$)^\/.*\.[^\n/]+$/;
}

function feed(siteConfig) {
  return new RegExp(`^${siteConfig.baseUrl}blog/(feed.xml|atom.xml)$`);
}

function noExtension() {
  return /\/[^.]*\/?$/;
}

function page(siteConfig) {
  const gr = (regex) => regex.toString().replace(/(^\/|\/$)/gm, '');

  if (siteConfig.docsUrl === '') {
    return new RegExp(
      `(?!${gr(blog(siteConfig))})^${siteConfig.baseUrl}.*.html$`,
    );
  }
  return new RegExp(
    `(?!${gr(blog(siteConfig))}|${gr(docs(siteConfig))})^${
      siteConfig.baseUrl
    }.*.html$`,
  );
}

function sitemap(siteConfig) {
  return new RegExp(`^${siteConfig.baseUrl}sitemap.xml$`);
}

module.exports = {
  blog,
  docs,
  dotfiles,
  feed,
  page,
  noExtension,
  sitemap,
};
