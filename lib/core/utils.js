/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;

function blogPostHasTruncateMarker(content) {
  return TRUNCATE_MARKER.test(content);
}

function extractBlogPostBeforeTruncate(content) {
  return content.split(TRUNCATE_MARKER)[0];
}

function removeExtension(pathStr) {
  return pathStr.replace(/\.[^/.]+$/, '');
}

function getPath(pathStr, cleanUrl = false) {
  if (!pathStr || !cleanUrl || !pathStr.endsWith('.html')) {
    return pathStr;
  }
  return pathStr.endsWith('/index.html')
    ? pathStr.replace(/index\.html$/, '')
    : removeExtension(pathStr);
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  getPath,
  removeExtension,
};
