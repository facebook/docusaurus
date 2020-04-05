/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {resolve} from 'url';
import {getSubFolder} from '@docusaurus/utils';
import {SourceToPermalink} from '../types';

export default function(
  fileString: string,
  filePath: string,
  docsDir: string,
  siteDir: string,
  sourceToPermalink: SourceToPermalink,
  versionedDir?: string,
) {
  // Determine the source dir. e.g: /website/docs, /website/versioned_docs/version-1.0.0
  let sourceDir: string | undefined;
  const thisSource = filePath;
  if (thisSource.startsWith(docsDir)) {
    sourceDir = docsDir;
  } else if (versionedDir && thisSource.startsWith(versionedDir)) {
    const specificVersionDir = getSubFolder(thisSource, versionedDir);
    // e.g: specificVersionDir = version-1.0.0
    if (specificVersionDir) {
      sourceDir = path.join(versionedDir, specificVersionDir);
    }
  }

  let content = fileString;

  // Replace internal markdown linking (except in fenced blocks).
  if (sourceDir) {
    let fencedBlock = false;
    const lines = content.split('\n').map(line => {
      if (line.trim().startsWith('```')) {
        fencedBlock = !fencedBlock;
      }
      if (fencedBlock) return line;

      let modifiedLine = line;
      // Replace inline-style links or reference-style links e.g:
      // This is [Document 1](doc1.md) -> we replace this doc1.md with correct link
      // [doc1]: doc1.md -> we replace this doc1.md with correct link
      const mdRegex = /(?:(?:\]\()|(?:\]:\s?))(?!https)([^'")\]\s>]+\.mdx?)/g;
      let mdMatch = mdRegex.exec(modifiedLine);
      while (mdMatch !== null) {
        // Replace it to correct html link.
        const mdLink = mdMatch[1];
        const targetSource = `${sourceDir}/${mdLink}`;
        const aliasedSource = (source: string) =>
          `@site/${path.relative(siteDir, source)}`;
        const permalink =
          sourceToPermalink[aliasedSource(resolve(thisSource, mdLink))] ||
          sourceToPermalink[aliasedSource(targetSource)];
        if (permalink) {
          modifiedLine = modifiedLine.replace(mdLink, permalink);
        }
        mdMatch = mdRegex.exec(modifiedLine);
      }
      return modifiedLine;
    });

    content = lines.join('\n');
  }

  return content;
}
