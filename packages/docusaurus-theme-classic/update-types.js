/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');

const inPath = './.tmp.d.ts';
const outPath = './src/types.d.ts';

let content = fs.readFileSync(inPath, 'utf-8');

const header = `/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@docusaurus/plugin-content-blog" />
/// <reference types="@docusaurus/plugin-content-docs" />
/// <reference types="@docusaurus/plugin-content-pages" />
`;

const toIgnore = [
  'translations',
  'index',
  '@theme/SearchBar',
  '@theme/MDXPage',
  '@theme/DocPage',
  '@theme/DocItem',
  '@theme/BlogListPage',
  '@theme/BlogPostPage',
  '@theme/BlogSidebar',
  '@theme/BlogTagsPostsPage',
  '@theme/BlogTagsListPage',
];

content = content
  // replace theme/*/index with @theme/*
  .replace(/theme\/([a-zA-Z0-9-]+)\/index/g, '@theme/$1')
  // replace theme/* with @theme/*
  .replace(/(?<!@)theme\/([a-zA-Z0-9-]+)/g, '@theme/$1')
  // remove css imports
  .replace(/\s+import .*'.+.css';/g, '')
  // remove multi-line comments - Copyright (c) Facebook
  .replace(/(\/\*[\s\S]*?\*\/[\n\r\s]+|\/\/\/.+)/gm, '')
  // update imports to type imports
  .replace(/import {/gm, 'import type {')
  .replace('/// <reference types="react" />\n', '')
  // ignore modules that are created by different packages
  .split('declare ')
  .filter((item) => {
    const match = item.match(/module "([^"]+)"/);
    return !match || !match[1] || !toIgnore.includes(match[1]);
  })
  .join('\ndeclare ');

fs.rmSync(inPath);
fs.writeFileSync(outPath, header + content, 'utf-8');
