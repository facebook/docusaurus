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
            try {
              // href gets coerced to a string when it gets rendered anyway
              const url = new URL(String(hrefAttr.value.value));
              if (url.protocol) {
                return;
              }
            } catch (e) {}
          }
        }

        context.report({node, messageId: 'link'});
      },
    };
  },
});
