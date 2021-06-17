/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {getOptions} = require('loader-utils');
const {readFile} = require('fs-extra');
const {createCompiler} = require('@mdx-js/mdx');
const emoji = require('remark-emoji');
const matter = require('gray-matter');
const stringifyObject = require('stringify-object');
const slug = require('./remark/slug');
const rightToc = require('./remark/rightToc');
const transformImage = require('./remark/transformImage');
const tranformAsset = require('./remark/transformAssets');

const pragma = `
/* @jsxRuntime classic */
/* @jsx mdx */
/* @jsxFrag mdx.Fragment */
`;

const DEFAULT_OPTIONS = {
  rehypePlugins: [],
  remarkPlugins: [emoji, slug, rightToc],
};

const compilerCache = new Map();

module.exports = async function (fileString) {
  const callback = this.async();

  const {data, content} = matter(fileString);
  if (!compilerCache.has(this.query)) {
    const reqOptions = getOptions(this) || {};
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
          tranformAsset,
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
    compilerCache.set(this.query, [createCompiler(options), options]);
  }
  const [compiler, options] = compilerCache.get(this.query);
  let result;

  try {
    result = await compiler.process({
      contents: content,
      path: this.resourcePath,
    });
  } catch (err) {
    return callback(err);
  }

  let exportStr = `export const frontMatter = ${stringifyObject(data)};`;

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
    if (
      options.forbidFrontMatter(this.resourcePath) &&
      Object.keys(data).length > 0
    ) {
      return callback(new Error(`Front matter is forbidden in this file`));
    }
  }
  const code = `
  ${pragma}
  import React from 'react';
  import { mdx } from '@mdx-js/react';

  ${exportStr}
  ${result}
  `;

  return callback(null, code);
};
