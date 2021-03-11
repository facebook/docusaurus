/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'url';
import {aliasedSitePath} from './index';

export type ContentPaths = {
  contentPath: string;
  contentPathLocalized: string;
};

export type BrokenMarkdownLink<T extends ContentPaths> = {
  filePath: string;
  contentPaths: T;
  link: string;
};

export type ReplaceMarkdownLinksParams<
  T extends ContentPaths,
  S extends unknown
> = {
  siteDir: string;
  sourceToPermalink: Record<string, S>;
  onBrokenMarkdownLink: (brokenMarkdownLink: BrokenMarkdownLink<T>) => void;
};

export function replaceMarkdownLinks<T extends ContentPaths, S extends unknown>(
  fileString: string,
  filePath: string,
  contentPaths: T,
  options: ReplaceMarkdownLinksParams<T, S>,
  getPermalink: (alias: S) => string,
): string {
  const {siteDir, sourceToPermalink, onBrokenMarkdownLink} = options;
  const {contentPath, contentPathLocalized} = contentPaths;

  // Replace internal markdown linking (except in fenced blocks).
  let fencedBlock = false;
  const lines = fileString.split('\n').map((line) => {
    if (line.trim().startsWith('```')) {
      fencedBlock = !fencedBlock;
    }
    if (fencedBlock) {
      return line;
    }

    let modifiedLine = line;
    // Replace inline-style links or reference-style links e.g:
    // This is [Document 1](doc1.md) -> we replace this doc1.md with correct link
    // [doc1]: doc1.md -> we replace this doc1.md with correct link
    const mdRegex = /(?:(?:\]\()|(?:\]:\s?))(?!https)([^'")\]\s>]+\.mdx?)/g;
    let mdMatch = mdRegex.exec(modifiedLine);
    while (mdMatch !== null) {
      // Replace it to correct html link.
      const mdLink = mdMatch[1];

      const aliasedSource = (source: string) =>
        aliasedSitePath(source, siteDir);

      const permalink =
        sourceToPermalink[aliasedSource(resolve(filePath, mdLink))] ||
        sourceToPermalink[aliasedSource(`${contentPathLocalized}/${mdLink}`)] ||
        sourceToPermalink[aliasedSource(`${contentPath}/${mdLink}`)];

      if (permalink) {
        modifiedLine = modifiedLine.replace(mdLink, getPermalink(permalink));
      } else {
        const brokenMarkdownLink: BrokenMarkdownLink<T> = {
          contentPaths,
          filePath,
          link: mdLink,
        };
        onBrokenMarkdownLink(brokenMarkdownLink);
      }
      mdMatch = mdRegex.exec(modifiedLine);
    }
    return modifiedLine;
  });

  return lines.join('\n');
}
