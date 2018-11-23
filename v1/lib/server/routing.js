/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {getCustomizedPathname} from './utils';

function blog(siteConfig) {
  return new RegExp(`^${siteConfig.baseUrl}blog/.*html$`);
}

function docs(siteConfig) {
  const customizedPathname = getCustomizedPathname(siteConfig);
  if (customizedPathname === '/') {
    // precisely one of `baseUrl` and `docsUrl` is `/`, and the other is empty
    // collides with the next slash
    return new RegExp(`^/.*/(?!index).*html$`);
  }
  return new RegExp(`^${getCustomizedPathname(siteConfig)}/.*html$`);
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
  const gr = regex => regex.toString().replace(/(^\/|\/$)/gm, '');
  return new RegExp(
    `(?!${gr(blog(siteConfig.baseUrl))})^${siteConfig.baseUrl}.*.html$`,
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
