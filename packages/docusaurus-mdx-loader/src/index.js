/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {readFile} = require('fs-extra');
const mdx = require('@mdx-js/mdx');
const emoji = require('remark-emoji');
const {
  parseFrontMatter,
  parseMarkdownContentTitle,
} = require('@docusaurus/utils');
const stringifyObject = require('stringify-object');
const headings = require('./remark/headings');
const toc = require('./remark/toc');
const unwrapMdxCodeBlocks = require('./remark/unwrapMdxCodeBlocks');
const transformImage = require('./remark/transformImage');
const transformLinks = require('./remark/transformLinks');

const DEFAULT_OPTIONS = {
  rehypePlugins: [],
  remarkPlugins: [unwrapMdxCodeBlocks, emoji, headings, toc],
};

module.exports = async function docusaurusMdxLoader(fileString) {
  const callback = this.async();

  const reqOptions = this.getOptions() || {};

  const {frontMatter, content: contentWithTitle} = parseFrontMatter(fileString);

  // By default, will remove the markdown title from the content
  const {content} = parseMarkdownContentTitle(contentWithTitle, {
    keepContentTitle: reqOptions.keepContentTitle,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  const options = {
    ...reqOptions,
    remarkPlugins: [
      ...(reqOptions.beforeDefaultRemarkPlugins || []),
      ...DEFAULT_OPTIONS.remarkPlugins,
      [
        transformImage,
        {staticDir: reqOptions.staticDir, filePath: this.resourcePath},
      ],
      [
        transformLinks,
        {staticDir: reqOptions.staticDir, filePath: this.resourcePath},
      ],
      ...(reqOptions.remarkPlugins || []),
    ],
    rehypePlugins: [
      ...(reqOptions.beforeDefaultRehypePlugins || []),
      ...DEFAULT_OPTIONS.rehypePlugins,

      ...(reqOptions.rehypePlugins || []),
    ],
    filepath: this.resourcePath,
  };
  let result;

  try {
    result = await mdx(content, options);
  } catch (err) {
    return callback(err);
  }

  let exportStr = `export const frontMatter = ${stringifyObject(frontMatter)};`;

  // Read metadata for this MDX and export it.
  if (options.metadataPath && typeof options.metadataPath === 'function') {
    const metadataPath = options.metadataPath(this.resourcePath);

    if (metadataPath) {
      // Add as dependency of this loader result so that we can
      // recompile if metadata is changed.
      this.addDependency(metadataPath);
      const metadata = await readFile(metadataPath, 'utf8');
      exportStr += `\nexport const metadata = ${metadata};`;
    }
  }

  if (
    options.forbidFrontMatter &&
    typeof options.forbidFrontMatter === 'function'
  ) {
    if (options.forbidFrontMatter(this.resourcePath) && hasFrontMatter) {
      return callback(new Error(`Front matter is forbidden in this file`));
    }
  }
  const code = `
  import React from 'react';
  import { mdx } from '@mdx-js/react';

  ${exportStr}
  ${result}
  `;

  return callback(null, code);
};
