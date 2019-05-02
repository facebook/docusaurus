/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fm = require('front-matter');
const {getOptions} = require('loader-utils');
const {resolve} = require('url');

module.exports = async function(fileString) {
  const callback = this.async();
  const options = Object.assign({}, getOptions(this), {
    filepath: this.resourcePath,
  });
  const {docsDir, sourceToPermalink} = options;

  // Extract content of markdown (without frontmatter).
  const {body} = fm(fileString);

  // Determine the source dir. e.g: /docs, /website/versioned_docs/version-1.0.0
  let sourceDir;
  const thisSource = this.resourcePath;
  if (thisSource.startsWith(docsDir)) {
    sourceDir = docsDir;
  }

  // Replace internal markdown linking (except in fenced blocks).
  let content = body;
  if (sourceDir) {
    let fencedBlock = false;
    const lines = body.split('\n').map(line => {
      if (line.trim().startsWith('```')) {
        fencedBlock = !fencedBlock;
      }
      if (fencedBlock) return line;

      let modifiedLine = line;
      // Replace inline-style links or reference-style links e.g:
      // This is [Document 1](doc1.md) -> we replace this doc1.md with correct link
      // [doc1]: doc1.md -> we replace this doc1.md with correct link
      const mdRegex = /(?:(?:\]\()|(?:\]:\s?))(?!https)([^'")\]\s>]+\.md)/g;
      let mdMatch = mdRegex.exec(modifiedLine);
      while (mdMatch !== null) {
        // Replace it to correct html link.
        const mdLink = mdMatch[1];
        const targetSource = `${sourceDir}/${mdLink}`;
        const permalink =
          sourceToPermalink[resolve(thisSource, mdLink)] ||
          sourceToPermalink[targetSource];
        if (permalink) {
          modifiedLine = modifiedLine.replace(mdLink, permalink);
        }
        mdMatch = mdRegex.exec(modifiedLine);
      }
      return modifiedLine;
    });
    content = lines.join('\n');
  }

  return callback(null, content);
};
