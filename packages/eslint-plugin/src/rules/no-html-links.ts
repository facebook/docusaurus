/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/types/dist/ts-estree';

const docsUrl = 'https://docusaurus.io/docs/docusaurus-core#link';

type Options = [
  {
    ignoreFullyResolved: boolean;
  },
];

type MessageIds = 'link';

function isFullyResolvedUrl(urlString: string): boolean {
  try {
    // href gets coerced to a string when it gets rendered anyway
    const url = new URL(String(urlString));
    if (url.protocol) {
      return true;
    }
  } catch (e) {}
  return false;
}

function staticPreEvaluate(node: TSESTree.Node): string | null {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral') {
    let result = '';
    for (let i = 0; i < node.quasis.length; i++) {
      const quasi = node.quasis[i];
      if (quasi) {
        result += quasi.value.raw;
      }
      if (i < node.expressions.length) {
        const expr = node.expressions[i];
        if (!expr) {
          return null;
        }
        const evaluated = staticPreEvaluate(expr);
        if (evaluated === null) {
          return null;
        }
        result += String(evaluated);
      }
    }
    return result;
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const left = staticPreEvaluate(node.left);
    const right = staticPreEvaluate(node.right);
    if (left !== null && right !== null) {
      return String(left) + String(right);
    }
  }
  return null;
}

export default createRule<Options, MessageIds>({
  name: 'no-html-links',
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce using Docusaurus Link component instead of <a> tag',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreFullyResolved: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      link: `Do not use an \`<a>\` element to navigate. Use the \`<Link />\` component from \`@docusaurus/Link\` instead. See: ${docsUrl}`,
    },
  },
  defaultOptions: [
    {
      ignoreFullyResolved: false,
    },
  ],

  create(context, [options]) {
    const {ignoreFullyResolved} = options;

    return {
      JSXOpeningElement(node) {
        if ((node.name as TSESTree.JSXIdentifier).name !== 'a') {
          return;
        }

        if (ignoreFullyResolved) {
          const hrefAttr = node.attributes.find(
            (attr): attr is TSESTree.JSXAttribute =>
              attr.type === 'JSXAttribute' && attr.name.name === 'href',
          );

          if (hrefAttr?.value?.type === 'Literal') {
            if (isFullyResolvedUrl(String(hrefAttr.value.value))) {
              return;
            }
          }
          if (hrefAttr?.value?.type === 'JSXExpressionContainer') {
            const container: TSESTree.JSXExpressionContainer = hrefAttr.value;
            const {expression} = container;
            const evaluated = staticPreEvaluate(expression);
            if (evaluated !== null && isFullyResolvedUrl(evaluated)) {
              return;
            }
          }
        }

        context.report({node, messageId: 'link'});
      },
    };
  },
});
