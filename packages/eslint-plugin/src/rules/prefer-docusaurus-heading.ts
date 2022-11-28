/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/types/dist/ts-estree';

type Options = [
  {
    includeAllHeadings: boolean;
  },
];
type MessageIds = 'headingTwo' | 'allHeadings';

export default createRule<Options, MessageIds>({
  name: 'prefer-docusaurus-heading',
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce using Docusaurus theme Heading component instead of <h2> tag',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          includeAllHeadings: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      headingTwo:
        'Do not use an `<h2>` tag for headings. Use the `<Heading />` component from `@theme/Heading` instead.',
      allHeadings:
        'Do not use `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>` or `<h6>` tags for headings. Use the `<Heading />` component from `@theme/Heading` instead.',
    },
  },
  defaultOptions: [
    {
      includeAllHeadings: false,
    },
  ],

  create(context, [options]) {
    const {includeAllHeadings} = options;
    const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    return {
      JSXOpeningElement(node) {
        const elementName = (node.name as TSESTree.JSXIdentifier).name;

        if (includeAllHeadings) {
          if (!headingTypes.includes(elementName)) {
            return;
          }
          context.report({node, messageId: 'allHeadings'});
          return;
        }

        // By default, this plugin would only check for `<h2>` tags.
        if (elementName !== 'h2') {
          return;
        }
        context.report({node, messageId: 'headingTwo'});
      },
    };
  },
});
