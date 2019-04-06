/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {getOptions} = require('loader-utils');
const mdx = require('@mdx-js/mdx');
const rehypePrism = require('@mapbox/rehype-prism');

const DEFAULT_OPTIONS = {
  rehypePlugins: [[rehypePrism, {ignoreMissing: true}]],
  prismTheme: 'prism-themes/themes/prism-atom-dark.css',
};

module.exports = async function(content) {
  const callback = this.async();

  const options = Object.assign(DEFAULT_OPTIONS, getOptions(this), {
    filepath: this.resourcePath,
  });
  let result;

  try {
    result = await mdx(content, options);
  } catch (err) {
    return callback(err);
  }

  const code = `
  import React from 'react';
  import { mdx } from '@mdx-js/react';
  import '${options.prismTheme}';
  ${result}
  `;

  return callback(null, code);
};
