/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loader} from 'webpack';
import {truncate, linkify} from './blogUtils';
const {parseQuery, getOptions} = require('loader-utils');

export = function (fileString: string) {
  const callback = this.async();
  const {truncateMarker, siteDir, contentPath, blogPosts} = getOptions(this);
  // Linkify posts
  let finalContent = linkify(fileString, siteDir, contentPath, blogPosts);

  // Truncate content if requested (e.g: file.md?truncated=true).
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (truncated) {
    finalContent = truncate(finalContent, truncateMarker);
  }

  return callback && callback(null, finalContent);
} as loader.Loader;
