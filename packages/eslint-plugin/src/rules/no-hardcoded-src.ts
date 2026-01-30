/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/utils';

export default createRule({
  name: 'no-hardcoded-src',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce using require() or useBaseUrl() for src attributes.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      hardcodedSrc:
        'Do not use a hardcoded string for the src attribute. Use require() or useBaseUrl() for image paths instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'img') {
          return;
        }

        const srcAttribute = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === 'JSXAttribute' && attr.name.name === 'src',
        );

        if (!srcAttribute) {
          return;
        }

        if (
          srcAttribute.value?.type === 'Literal' &&
          typeof srcAttribute.value.value === 'string' &&
          srcAttribute.value.value.trim().length > 0
        ) {
          context.report({
            node: srcAttribute,
            messageId: 'hardcodedSrc',
          });
        }
      },
    };
  },
});
