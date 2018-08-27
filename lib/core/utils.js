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

function removeExtension(path) {
  return path.replace(/\.[^/.]+$/, '');
}

function getPath(path, cleanUrl = false) {
  if (cleanUrl) {
    return path.endsWith('/index.html')
      ? path.replace(/\/index.html$/, '')
      : removeExtension(path);
  }
  return path;
}

function getDeepProp(target, path) {
  return path
    .split('.')
    .filter(key => key !== '')
    .reduce((obj, key) => obj && (obj[key] || undefined), target);
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  getPath,
  removeExtension,
  getDeepProp,
};
