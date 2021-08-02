/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
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

export type ReplaceMarkdownLinksParams<T extends ContentPaths> = {
  siteDir: string;
  fileString: string;
  filePath: string;
  contentPaths: T;
  sourceToPermalink: Record<string, string>;
};

export type ReplaceMarkdownLinksReturn<T extends ContentPaths> = {
  newContent: string;
  brokenMarkdownLinks: BrokenMarkdownLink<T>[];
};

export function replaceMarkdownLinks<T extends ContentPaths>({
  siteDir,
  fileString,
  filePath,
  contentPaths,
  sourceToPermalink,
}: ReplaceMarkdownLinksParams<T>): ReplaceMarkdownLinksReturn<T> {
  const {contentPath, contentPathLocalized} = contentPaths;

  const brokenMarkdownLinks: BrokenMarkdownLink<T>[] = [];

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

      const sourcesToTry = [
        path.resolve(path.dirname(filePath), decodeURIComponent(mdLink)),
        `${contentPathLocalized}/${decodeURIComponent(mdLink)}`,
        `${contentPath}/${decodeURIComponent(mdLink)}`,
      ];

      const aliasedSourceMatch = sourcesToTry
        .map((source) => aliasedSitePath(source, siteDir))
        .find((source) => sourceToPermalink[source]);

      const permalink: string | undefined = aliasedSourceMatch
        ? sourceToPermalink[aliasedSourceMatch]
        : undefined;

      if (permalink) {
        // MDX won't be happy if the permalink contains a space, we need to convert it to %20
        const encodedPermalink = permalink
          .split('/')
          .map((part) => part.replace(/\s/g, '%20'))
          .join('/');
        modifiedLine = modifiedLine.replace(mdLink, encodedPermalink);
      } else {
        const brokenMarkdownLink: BrokenMarkdownLink<T> = {
          contentPaths,
          filePath,
          link: mdLink,
        };

        brokenMarkdownLinks.push(brokenMarkdownLink);
      }
      mdMatch = mdRegex.exec(modifiedLine);
    }
    return modifiedLine;
  });

  const newContent = lines.join('\n');

  return {newContent, brokenMarkdownLinks};
}
