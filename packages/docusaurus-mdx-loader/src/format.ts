/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import type {MDXFrontMatter} from './frontMatter';

// Copied from https://mdxjs.com/packages/mdx/#optionsmdextensions
// Although we are likely to only use .md / .mdx anyway...
const mdFormatExtensions = [
  '.md',
  '.markdown',
  '.mdown',
  '.mkdn',
  '.mkd',
  '.mdwn',
  '.mkdown',
  '.ron',
];

function isMDFormat(filepath: string) {
  return mdFormatExtensions.includes(path.extname(filepath));
}

export function getFormat({
  filePath,
  frontMatterFormat,
}: {
  filePath: string;
  frontMatterFormat: MDXFrontMatter['format'];
}): 'md' | 'mdx' {
  if (frontMatterFormat !== 'detect') {
    return frontMatterFormat;
  }
  // Bias toward mdx if unknown extension
  return isMDFormat(filePath) ? 'md' : 'mdx';
}
