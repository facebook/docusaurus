/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DEFAULT_PARSE_FRONT_MATTER} from '@docusaurus/utils';
import type {MarkdownConfig} from '@docusaurus/types';

export const DefaultMarkdownConfig: MarkdownConfig = {
  format: 'mdx',
  mermaid: false,
  emoji: true,
  preprocessor: undefined,
  parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
  mdx1Compat: {comments: true, admonitions: true, headingIds: true},
  anchors: {maintainCase: false},
  remarkRehypeOptions: undefined,
  hooks: {
    onBrokenMarkdownLinks: 'warn',
    onBrokenMarkdownImages: 'warn',
    onUnusedMarkdownDirectives: 'warn',
  },
};
