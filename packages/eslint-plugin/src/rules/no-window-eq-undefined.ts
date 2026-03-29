/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Rule} from 'eslint';

/**
 * @see https://github.com/facebook/docusaurus/issues/6472
 *
 * Forbids the use of `typeof window !== 'undefined'` as an SSR escape hatch.
 * Docusaurus provides `useIsBrowser()` and `ExecutionEnvironment.canUseDOM`
 * for this purpose, which integrate correctly with its SSR pipeline.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow `typeof window !== "undefined"` as an SSR escape hatch',
      recommended: false,
      url: 'https://docusaurus.io/docs/api/misc/@docusaurus/eslint-plugin/no-window-eq-undefined',
    },
    messages: {
      noWindowEqUndefined:
        'Do not use `typeof window !== "undefined"` to check for a browser environment. ' +
        'Use `useIsBrowser()` from `@docusaurus/useIsBrowser` inside React components, ' +
        'or `ExecutionEnvironment.canUseDOM` from `@docusaurus/ExecutionEnvironment` outside of them.',
    },
    schema: [],
  },

  create(context) {
    function isTypeofWindow(node: Rule.Node): boolean {
      return (
        node.type === 'UnaryExpression' &&
        (node as {operator: string}).operator === 'typeof' &&
        (node as {argument: {type: string; name: string}}).argument.type ===
          'Identifier' &&
        (node as {argument: {type: string; name: string}}).argument.name ===
          'window'
      );
    }

    function isUndefinedString(node: Rule.Node): boolean {
      return (
        node.type === 'Literal' &&
        (node as {value: unknown}).value === 'undefined'
      );
    }

    return {
      BinaryExpression(node) {
        const {operator, left, right} = node;
        if (!['===', '!==', '==', '!='].includes(operator)) {
          return;
        }
        if (
          (isTypeofWindow(left) && isUndefinedString(right)) ||
          (isUndefinedString(left) && isTypeofWindow(right))
        ) {
          context.report({node, messageId: 'noWindowEqUndefined'});
        }
      },
    };
  },
};

export default rule;
