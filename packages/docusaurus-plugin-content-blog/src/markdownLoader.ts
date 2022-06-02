/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {truncate, linkify} from './blogUtils';
import type {BlogMarkdownLoaderOptions} from './types';
import type {LoaderContext} from 'webpack';

export default function markdownLoader(
  this: LoaderContext<BlogMarkdownLoaderOptions>,
  source: string,
): void {
  const filePath = this.resourcePath;
  const fileString = source;
  const callback = this.async();
  const markdownLoaderOptions = this.getOptions();

  // Linkify blog posts
  let finalContent = linkify({
    fileString,
    filePath,
    ...markdownLoaderOptions,
  });

  // Truncate content if requested (e.g: file.md?truncated=true).
  const truncated: boolean | undefined = this.resourceQuery
    ? !!new URLSearchParams(this.resourceQuery.slice(1)).get('truncated')
    : undefined;

  if (truncated) {
    finalContent = truncate(finalContent, markdownLoaderOptions.truncateMarker);
  }

  return callback(null, finalContent);
}
