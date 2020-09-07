/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {resolve} from 'url';
import {
  DocsMarkdownOption,
  VersionMetadata,
  BrokenMarkdownLink,
} from '../types';
import {getDocsDirPaths} from '../versions';

function getVersion(filePath: string, options: DocsMarkdownOption) {
  const versionFound = options.versionsMetadata.find((version) =>
    getDocsDirPaths(version).some((docsDirPath) =>
      filePath.startsWith(docsDirPath),
    ),
  );
  if (!versionFound) {
    throw new Error(
      `Unexpected, markdown file does not belong to any docs version! file=${filePath}`,
    );
  }
  return versionFound;
}

function replaceMarkdownLinks(
  fileString: string,
  filePath: string,
  version: VersionMetadata,
  options: DocsMarkdownOption,
) {
  const {siteDir, sourceToPermalink, onBrokenMarkdownLink} = options;
  const {docsDirPath} = version;

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
      const targetSource = `${docsDirPath}/${mdLink}`;
      const aliasedSource = (source: string) =>
        `@site/${path.relative(siteDir, source)}`;
      const permalink =
        sourceToPermalink[aliasedSource(resolve(filePath, mdLink))] ||
        sourceToPermalink[aliasedSource(targetSource)];
      if (permalink) {
        modifiedLine = modifiedLine.replace(mdLink, permalink);
      } else {
        const brokenMarkdownLink: BrokenMarkdownLink = {
          version,
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

export function linkify(
  fileString: string,
  filePath: string,
  options: DocsMarkdownOption,
): string {
  const version = getVersion(filePath, options);
  return replaceMarkdownLinks(fileString, filePath, version, options);
}
