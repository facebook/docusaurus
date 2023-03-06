/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor} from 'unified';
import type {Code} from 'mdast';

// Solution inspired by https://github.com/pomber/docusaurus-mdx-2/blob/main/packages/mdx-loader/src/remark/codeCompat/index.ts
// TODO after MDX 2 we probably don't need this - remove soon?
// Only fenced code blocks are swapped by pre/code MDX components
// Using <pre><code> in JSX shouldn't use our MDX components anymore

// To make theme-classic/src/theme/MDXComponents/Pre work
// we need to fill two properties that mdx v2 doesn't provide anymore
export default function codeCompatPlugin(this: Processor): Transformer {
  return (root) => {
    visit(root, 'code', (node: Code) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node.data.hProperties as any).metastring = node.meta;

      // Retrocompatible support for live codeblock metastring
      // Not really the appropriate place to handle that :s
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node.data.hProperties as any).live = node.meta
        ?.split(' ')
        .includes('live');
    });
  };
}
