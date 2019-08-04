/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {getOptions} = require('loader-utils');
const mdx = require('@mdx-js/mdx');
const emoji = require('remark-emoji');
const slug = require('remark-slug');
const matter = require('gray-matter');
const stringifyObject = require('stringify-object');
const rightToc = require('./remark/rightToc');

const DEFAULT_OPTIONS = {
  rehypePlugins: [],
  remarkPlugins: [emoji, slug, rightToc],
};

module.exports = async function(fileString) {
  const callback = this.async();

  const {data, content} = matter(fileString);
  const reqOptions = getOptions(this) || {};
  const options = {
    ...reqOptions,
    remarkPlugins: [
      ...DEFAULT_OPTIONS.remarkPlugins,
      ...(reqOptions.remarkPlugins || []),
    ],
    rehypePlugins: [
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

  const code = `
  import React from 'react';
  import { mdx } from '@mdx-js/react';

  export const frontMatter = ${stringifyObject(data)};
  ${result}
  `;

  return callback(null, code);
};
