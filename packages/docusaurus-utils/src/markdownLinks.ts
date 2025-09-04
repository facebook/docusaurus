/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {getContentPathList} from './dataFileUtils';
import {aliasedSitePath} from './pathUtils';

/**
 * Content plugins have a base path and a localized path to source content from.
 * We will look into the localized path in priority.
 */
export type ContentPaths = {
  /**
   * The absolute path to the base content directory, like `"<siteDir>/docs"`.
   */
  contentPath: string;
  /**
   * The absolute path to the localized content directory, like
   * `"<siteDir>/i18n/zh-Hans/plugin-content-blog"`.
   *
   * Undefined when the locale has `translate: false` config
   */
  contentPathLocalized: string | undefined;
};

/** Data structure representing each broken Markdown link to be reported. */
export type BrokenMarkdownLink<T extends ContentPaths> = {
  /** Absolute path to the file containing this link. */
  filePath: string;
  /**
   * This is generic because it may contain extra metadata like version name,
   * which the reporter can provide for context.
   */
  contentPaths: T;
  /**
   * The content of the link, like `"./brokenFile.md"`
   */
  link: string;
};

export type SourceToPermalink = Map<
  string, // Aliased source path: "@site/docs/content.mdx"
  string // Permalink: "/docs/content"
>;

export function resolveMarkdownLinkPathname(
  linkPathname: string,
  context: {
    sourceFilePath: string;
    sourceToPermalink: SourceToPermalink;
    contentPaths: ContentPaths;
    siteDir: string;
  },
): string | null {
  const {sourceFilePath, sourceToPermalink, contentPaths, siteDir} = context;

  if (linkPathname.startsWith('@site/')) {
    return sourceToPermalink.get(decodeURIComponent(linkPathname)) ?? null;
  }

  const sourceDirsToTry: string[] = [];

  if (linkPathname.startsWith('/')) {
    sourceDirsToTry.push(...getContentPathList(contentPaths), siteDir);
  } else if (linkPathname.startsWith('./') || linkPathname.startsWith('../')) {
    sourceDirsToTry.push(path.dirname(sourceFilePath));
  } else {
    // first try relative to the source file path
    sourceDirsToTry.push(path.dirname(sourceFilePath));
    // then try relative to all content paths (localized first)
    sourceDirsToTry.push(...getContentPathList(contentPaths), siteDir);
  }

  const sourcesToTry = sourceDirsToTry
    .map((sourceDir) => path.join(sourceDir, decodeURIComponent(linkPathname)))
    .map((source) => aliasedSitePath(source, siteDir));

  const aliasedSourceMatch = sourcesToTry.find((source) =>
    sourceToPermalink.has(source),
  );

  return aliasedSourceMatch
    ? sourceToPermalink.get(aliasedSourceMatch) ?? null
    : null;
}
