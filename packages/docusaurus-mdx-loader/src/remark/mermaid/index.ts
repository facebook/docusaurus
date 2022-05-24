/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import type {Transformer} from 'unified';
import type {Data, Literal, Node, Parent} from 'unist';

type CodeMermaid = Literal<string> & {
  type: 'code';
  lang: 'mermaid';
};

function processMermaidNode(
  node: CodeMermaid,
  index: number,
  parent: Parent<Node<Data> | Literal, Data>,
) {
  parent.children.splice(index, 1, {
    type: 'jsx',
    value: `<mermaid value={\`${node.value}\`}/>`,
    position: node.position,
  });
}

export default function plugin(): Transformer {
  return async (root) => {
    // Find all the mermaid diagram code blocks. i.e. ```mermaid
    const instances: [CodeMermaid, number, Parent<Node<Data>, Data>][] = [];
    visit(
      root,
      {type: 'code', lang: 'mermaid'},
      (node: CodeMermaid, index, parent) => {
        if (parent) {
          instances.push([node, index, parent]);
        }
      },
    );

    // Replace each Mermaid code block with the Mermaid component
    instances.forEach(([node, index, parent]) => {
      processMermaidNode(node, index, parent);
    });
  };
}
