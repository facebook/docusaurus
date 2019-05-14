/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {getOptions} = require('loader-utils');
const mdx = require('@mdx-js/mdx');
const rehypePrism = require('@mapbox/rehype-prism');
const emoji = require('remark-emoji');
const slug = require('remark-slug');
const matter = require('gray-matter');
const stringifyObject = require('stringify-object');
const linkHeadings = require('./linkHeadings');
const rightToc = require('./rightToc');

const DEFAULT_OPTIONS = {
  rehypePlugins: [[rehypePrism, {ignoreMissing: true}], linkHeadings],
  remarkPlugins: [emoji, slug, rightToc],
  prismTheme: 'prism-themes/themes/prism-atom-dark.css',
};

module.exports = async function(fileString) {
  const callback = this.async();

  const {data, content} = matter(fileString);
  const options = Object.assign(DEFAULT_OPTIONS, getOptions(this), {
    filepath: this.resourcePath,
  });
  let result;

  try {
    result = await mdx(content, options);
  } catch (err) {
    return callback(err);
  }

  let importStr = '';
  // If webpack target is web, we can import the css
  if (this.target === 'web') {
    importStr = `import '${options.prismTheme}';`;
  }

  const code = `
  import React from 'react';
  import { mdx } from '@mdx-js/react';
  ${importStr}
  export const frontMatter = ${stringifyObject(data)};
  ${result}
  `;

  return callback(null, code);
};
