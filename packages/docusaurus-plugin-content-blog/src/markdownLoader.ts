/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loader} from 'webpack';
import {truncate, linkify} from './blogUtils';
import {parseQuery, getOptions} from 'loader-utils';

const markdownLoader: loader.Loader = function (source) {
  const fileString = source as string;
  const callback = this.async();
  const {truncateMarker, siteDir, contentPaths, blogPosts} = getOptions(this);

  // Linkify posts
  let finalContent = linkify(
    fileString as string,
    siteDir,
    contentPaths,
    blogPosts,
  );

  // Truncate content if requested (e.g: file.md?truncated=true).
  const truncated: string | undefined = this.resourceQuery
    ? parseQuery(this.resourceQuery).truncated
    : undefined;

  if (truncated) {
    finalContent = truncate(finalContent, truncateMarker);
  }

  return callback && callback(null, finalContent);
};

export default markdownLoader;
