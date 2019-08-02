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

const PERSIST_OPTIONS = {
  rehypePlugins: [],
  remarkPlugins: [emoji, slug, rightToc],
};

const DEFAULT_OPTIONS = {
  rehypePlugins: [],
  remarkPlugins: [],
  onInput: v => v, // input preprocess
  onRemarkPlugins: () => [], // per input remark plugins
  onRehypePlugins: () => [], // per input rehype plugins
};

module.exports = async function(fileString) {
  const callback = this.async();

  const {
    remarkPlugins,
    rehypePlugins,
    onInput,
    onRemarkPlugins,
    onRehypePlugins,
    ...reqOptions
  } = {...DEFAULT_OPTIONS, ...getOptions(this)};

  let result;
  let data;

  try {
    const input = await onInput(matter(fileString));

    const options = {
      ...reqOptions,
      remarkPlugins: [
        ...PERSIST_OPTIONS.remarkPlugins,
        ...(remarkPlugins || []),
        ...((await onRemarkPlugins(input)) || []),
      ],
      rehypePlugins: [
        ...PERSIST_OPTIONS.rehypePlugins,
        ...(rehypePlugins || []),
        ...((await onRemarkPlugins(input)) || []),
      ],
      filepath: this.resourcePath,
    };

    const {data: frontMatter, content} = input;
    data = frontMatter;

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
