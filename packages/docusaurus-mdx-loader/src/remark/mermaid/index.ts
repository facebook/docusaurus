/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import type {Transformer} from 'unified';
import type {Data, Literal, Node, Parent} from 'unist';
import type {Code} from 'mdast';

function processMermaidNode(
  node: Code,
  index: number,
  parent: Parent<Node<Data> | Literal, Data>,
) {
  parent.children.splice(index, 1, {
    type: 'mermaidCodeBlock',
    data: {
      hName: 'mermaid',
      hProperties: {
        value: node.value,
      },
    },
  });
}

export default function plugin(): Transformer {
  return (root) => {
    visit(root, 'code', (node: Code, index, parent) => {
      if (node.lang === 'mermaid') {
        processMermaidNode(node, index, parent!);
      }
    });
  };
}
