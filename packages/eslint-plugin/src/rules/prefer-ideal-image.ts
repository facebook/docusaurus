/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/types/dist/ts-estree';

type Options = [];
type MessageIds = 'idealImageError' | 'idealImageWarning';

const docsUrl =
  'https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image';

export default createRule<Options, MessageIds>({
  name: 'prefer-ideal-image',
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce using Docusaurus IdealImage plugin component instead of <img> tags',
      recommended: false,
    },
    schema: [],
    messages: {
      idealImageError: `Do not use an \`<img>\` element to embed images. Use the \`<IdealImage />\` component from \`@theme/IdealImage\` instead. See ${docsUrl}`,
      idealImageWarning: `If this is a local file do not use an \`<img>\` element to embed images. Use the \`<IdealImage />\` component from \`@theme/IdealImage\` instead. See ${docsUrl}`,
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName = (node.name as TSESTree.JSXIdentifier).name;

        if (elementName !== 'img') {
          return;
        }

        const srcAttr = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === 'JSXAttribute' && attr.name.name === 'src',
        );

        const value = srcAttr?.value;

        if (!value) {
          return;
        }

        if (value.type === 'Literal' && typeof value.value === 'string') {
          const val = value.value;

          if (val.toLowerCase().endsWith('.svg')) {
            return;
          }

          if (val.startsWith('http') || val.startsWith('//')) {
            return;
          }
          if (
            val.startsWith('./') ||
            val.startsWith('../') ||
            val.startsWith('/')
          ) {
            context.report({node: value, messageId: 'idealImageWarning'});
          }
          return;
        }

        if (value.type === 'JSXExpressionContainer') {
          const expr = value.expression;

          if (expr.type === 'TemplateLiteral') {
            const firstPart = expr.quasis[0]?.value.raw;
            if (firstPart?.startsWith('http') || firstPart?.startsWith('//')) {
              return;
            }
          }

          if (
            expr.type === 'CallExpression' &&
            expr.callee.type === 'Identifier' &&
            expr.callee.name === 'require'
          ) {
            context.report({node, messageId: 'idealImageError'});
          }
        }
      },
    };
  },
});
