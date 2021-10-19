/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const GitHubSlugger = require('github-slugger');

/**
 * Converts a string to a slug, that can be used in heading anchors
 *
 * @param  {string} string
 * @param  {() => string} [slugger] - reused slugger to track used slugs and
 *                                 ensure that new slug will be unique
 *
 * @return {string}
 */
module.exports = (string, slugger = new GitHubSlugger()) => {
  return slugger.slug(string);
};
