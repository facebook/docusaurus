/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Transformer, Plugin} from 'unified';
import type {Root} from 'mdast';

// Solution inspired by https://github.com/pomber/docusaurus-mdx-2/blob/main/packages/mdx-loader/src/remark/codeCompat/index.ts
// TODO after MDX 2 we probably don't need this - remove soon?
// Only fenced code blocks are swapped by pre/code MDX components
// Using <pre><code> in JSX shouldn't use our MDX components anymore

// To make theme-classic/src/theme/MDXComponents/Pre work
// we need to fill two properties that mdx v2 doesn't provide anymore
const plugin: Plugin<unknown[], Root> = function plugin(): Transformer<Root> {
  return async (root) => {
    const {visit} = await import('unist-util-visit');

    visit(root, 'code', (node) => {
      node.data = node.data || {};

      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.metastring = node.meta;

      // TODO Docusaurus v4: remove special case
      // Retrocompatible support for live codeblock metastring
      // Not really the appropriate place to handle that :s
      node.data.hProperties.live = node.meta?.split(' ').includes('live');
    });
  };
};

export default plugin;
