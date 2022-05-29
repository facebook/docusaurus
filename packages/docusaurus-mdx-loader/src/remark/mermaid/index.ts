/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import type {Transformer} from 'unified';
import type {Code} from 'mdast';

// TODO: this plugin shouldn't be in the core MDX loader
// After we allow plugins to provide Remark/Rehype plugins (see
// https://github.com/facebook/docusaurus/issues/6370), this should be provided
// by theme-mermaid itself
export default function plugin(): Transformer {
  return (root) => {
    visit(root, 'code', (node: Code, index, parent) => {
      if (node.lang === 'mermaid') {
        parent!.children.splice(index, 1, {
          type: 'mermaidCodeBlock',
          data: {
            hName: 'mermaid',
            hProperties: {
              value: node.value,
            },
          },
        });
      }
    });
  };
}
