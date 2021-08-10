/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit, {Visitor} from 'unist-util-visit';
import type {Plugin, Transformer, Processor} from 'unified';
import type {Node, CodeBlockNode} from '@docusaurus/mdx-loader';

// This plugin is mostly to help integrating Docusaurus with translation systems
// that do not support well MDX embedded JSX syntax (like Crowdin)
// We wrap the JSX syntax in code blocks so that translation tools don't mess-up with the markup
// But the JSX inside such code blocks should still be evaluated as JSX
// See https://github.com/facebook/docusaurus/pull/4278
const plugin: Plugin<[]> = () => {
  const transformer: Transformer = function (this: Processor, root) {
    const visitor: Visitor<CodeBlockNode> = (node, _index, parent) => {
      if (node.lang === 'mdx-code-block') {
        const newChildren = (this.parse(node.value!) as Node).children!;

        // Replace the mdx code block by its content, parsed
        parent!.children.splice(
          parent!.children.indexOf(node),
          1,
          ...newChildren,
        );
      }
    };
    visit(root, 'code', visitor);
  };

  return transformer;
};

export default plugin;
