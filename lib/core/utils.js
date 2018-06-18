/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const BLOG_POST_SUMMARY_LENGTH = 250;
const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;

function blogPostHasTruncateMarker(content) {
  return TRUNCATE_MARKER.test(content);
}

function extractBlogPostBeforeTruncate(content) {
  return content.split(TRUNCATE_MARKER)[0];
}

function extractBlogPostSummary(content) {
  return content.substring(0, BLOG_POST_SUMMARY_LENGTH);
}

function getPath(path, cleanUrl = false) {
  if (cleanUrl) {
    if (path.endsWith('/index.html')) {
      return path.replace(/\/index.html$/, '');
    } else {
      return path.replace(/\.html$/, '');
    }
  }
  return path;
}

module.exports = {
  blogPostHasTruncateMarker,
  extractBlogPostBeforeTruncate,
  extractBlogPostSummary,
  getPath,
};
