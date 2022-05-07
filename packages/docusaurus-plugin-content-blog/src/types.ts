/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {BrokenMarkdownLink, ContentPaths} from '@docusaurus/utils';

export type BlogContentPaths = ContentPaths;

export type BlogBrokenMarkdownLink = BrokenMarkdownLink<BlogContentPaths>;
export type BlogMarkdownLoaderOptions = {
  siteDir: string;
  contentPaths: BlogContentPaths;
  truncateMarker: RegExp;
  sourceToPermalink: {[aliasedPath: string]: string};
  onBrokenMarkdownLink: (brokenMarkdownLink: BlogBrokenMarkdownLink) => void;
};
