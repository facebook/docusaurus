/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const visit = require('unist-util-visit');

// This plugin is mostly to help integrating Docusaurus with translation systems
// that do not support well MDX embedded JSX syntax (like Crowdin)
// We wrap the JSX syntax in code blocks so that translation tools don't mess-up with the markup
// But the JSX inside such code blocks should still be evaluated as JSX
// See https://github.com/facebook/docusaurus/pull/4278
function plugin() {
  const transformer = (root) => {
    visit(root, 'code', (node, _index, parent) => {
      if (node.lang === 'mdx-code-block') {
        const newChildrens = this.parse(node.value).children;

        // Replace the mdx code block by its content, parsed
        parent.children.splice(
          parent.children.indexOf(node),
          1,
          ...newChildrens,
        );
      }
    });
  };

  return transformer;
}

module.exports = plugin;
