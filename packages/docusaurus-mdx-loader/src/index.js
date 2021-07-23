/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {readFile} = require('fs-extra');
const mdx = require('@mdx-js/mdx');
const chalk = require('chalk');
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

// When this throws, it generally means that there's no metadata file associated with this MDX document
// It can happen when using MDX partials (usually starting with _)
// That's why it's important to provide the "isMDXPartial" function in config
async function readMetadataPath(metadataPath) {
  try {
    return await readFile(metadataPath, 'utf8');
  } catch (e) {
    throw new Error(
      `MDX loader can't read MDX metadata file for path ${metadataPath}. Maybe the isMDXPartial option function was not provided?`,
    );
  }
}

module.exports = async function docusaurusMdxLoader(fileString) {
  const callback = this.async();

  const reqOptions = this.getOptions() || {};

  const {frontMatter, content: contentWithTitle} = parseFrontMatter(fileString);

  const {content, contentTitle} = parseMarkdownContentTitle(contentWithTitle, {
    removeContentTitle: reqOptions.removeContentTitle,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  const filePath = this.resourcePath;

  const options = {
    ...reqOptions,
    remarkPlugins: [
      ...(reqOptions.beforeDefaultRemarkPlugins || []),
      ...DEFAULT_OPTIONS.remarkPlugins,
      [transformImage, {staticDir: reqOptions.staticDir, filePath}],
      [transformLinks, {staticDir: reqOptions.staticDir, filePath}],
      ...(reqOptions.remarkPlugins || []),
    ],
    rehypePlugins: [
      ...(reqOptions.beforeDefaultRehypePlugins || []),
      ...DEFAULT_OPTIONS.rehypePlugins,

      ...(reqOptions.rehypePlugins || []),
    ],
    filepath: filePath,
  };

  let result;
  try {
    result = await mdx(content, options);
  } catch (err) {
    return callback(err);
  }

  let exportStr = ``;
  exportStr += `\nexport const frontMatter = ${stringifyObject(frontMatter)};`;
  exportStr += `\nexport const contentTitle = ${stringifyObject(
    contentTitle,
  )};`;

  // MDX partials are MDX files starting with _ or in a folder starting with _
  // Partial are not expected to have an associated metadata file or frontmatter
  const isMDXPartial = options.isMDXPartial
    ? options.isMDXPartial(filePath)
    : false;

  if (isMDXPartial && hasFrontMatter) {
    const errorMessage = `Docusaurus MDX partial files should not contain FrontMatter.
Those partial files use the _ prefix as a convention by default, but this is configurable.
File at ${filePath} contains FrontMatter that will be ignored: \n${JSON.stringify(
      frontMatter,
      null,
      2,
    )}`;
    const shouldError = process.env.NODE_ENV === 'test' || process.env.CI;
    if (shouldError) {
      return callback(new Error(errorMessage));
    } else {
      console.warn(chalk.yellow(errorMessage));
    }
  }

  if (!isMDXPartial) {
    // Read metadata for this MDX and export it.
    if (options.metadataPath && typeof options.metadataPath === 'function') {
      const metadataPath = options.metadataPath(filePath);

      if (metadataPath) {
        const metadata = await readMetadataPath(metadataPath);
        exportStr += `\nexport const metadata = ${metadata};`;
        // Add as dependency of this loader result so that we can
        // recompile if metadata is changed.
        this.addDependency(metadataPath);
      }
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
