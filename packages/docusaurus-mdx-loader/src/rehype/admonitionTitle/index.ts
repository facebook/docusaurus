/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {visit} from 'unist-util-visit';
import {toEstree} from 'hast-util-to-estree';
import type {Root} from 'hast';
import type {Plugin} from 'unified';

// Run after user rehype plugins so rich title content receives the same
// transformations as the body before it becomes a JSX attribute expression.
const plugin: Plugin<[], Root> = function plugin() {
  return (root) => {
    visit(root, 'mdxJsxFlowElement', (node) => {
      if (node.name !== 'Admonition') {
        return;
      }

      const titleIndex = node.children.findIndex(
        (child) =>
          child.type === 'mdxJsxTextElement' &&
          child.data?.admonitionTitle === true,
      );
      if (titleIndex === -1) {
        return;
      }

      const [title] = node.children.splice(titleIndex, 1);
      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: 'title',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: '',
          data: {estree: toEstree(title!)},
        },
      });
    });
  };
};

export default plugin;
