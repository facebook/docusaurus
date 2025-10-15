/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {ESLintUtils} from '@typescript-eslint/utils';
import type { TSESTree} from '@typescript-eslint/utils';

export const noHardcodedSrcRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/facebook/docusaurus',
)({
  name: 'no-hardcoded-src',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded src attributes in JSX elements.',
      recommended: false,
    },
    messages: {
      noHardcodedSrc: "Avoid using hardcoded URLs in 'src' attributes.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        if (
          node.name.name === 'src' &&
          node.value &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          context.report({
            node,
            messageId: 'noHardcodedSrc',
          });
        }
      },
    };
  },
});

export default noHardcodedSrcRule;
