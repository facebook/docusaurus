/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import type {Transformer, Processor} from 'unified';
import type {Code, Parent} from 'mdast';

// This plugin is mostly to help integrating Docusaurus with translation systems
// that do not support well MDX embedded JSX syntax (like Crowdin)
// We wrap the JSX syntax in code blocks so that translation tools don't mess-up with the markup
// But the JSX inside such code blocks should still be evaluated as JSX
// See https://github.com/facebook/docusaurus/pull/4278
function plugin(this: Processor): Transformer {
  const transformer: Transformer = (root) => {
    visit(root, 'code', (node: Code, _index, parent) => {
      if (node.lang === 'mdx-code-block') {
        const newChildren = (this!.parse(node.value) as Parent).children;

        // Replace the mdx code block by its content, parsed
        parent!.children.splice(
          parent!.children.indexOf(node),
          1,
          ...newChildren,
        );
      }
    });
  };

  return transformer;
}

export default plugin;
