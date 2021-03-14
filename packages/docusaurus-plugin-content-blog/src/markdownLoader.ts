/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loader} from 'webpack';
import {truncate, linkify} from './blogUtils';
import {parseQuery, getOptions} from 'loader-utils';
import {BlogMarkdownLoaderOptions} from './types';

const markdownLoader: loader.Loader = function (source) {
  const filePath = this.resourcePath;
  const fileString = source as string;
  const callback = this.async();
  const markdownLoaderOptions = getOptions(this) as BlogMarkdownLoaderOptions;

  // Linkify blog posts
  let finalContent = linkify({
    fileString,
    filePath,
    ...markdownLoaderOptions,
  });

  // Truncate content if requested (e.g: file.md?truncated=true).
  const truncated: string | undefined = this.resourceQuery
    ? parseQuery(this.resourceQuery).truncated
    : undefined;

  if (truncated) {
    finalContent = truncate(finalContent, markdownLoaderOptions.truncateMarker);
  }

  return callback && callback(null, finalContent);
};

export default markdownLoader;
