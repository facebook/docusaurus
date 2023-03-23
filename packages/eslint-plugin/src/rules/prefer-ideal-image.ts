/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/types/dist/ts-estree';

type Options = [];
type MessageIds = 'image';

const docsUrl =
  'https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image';

export default createRule<Options, MessageIds>({
  name: 'prefer-ideal-image',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce using Docusaurus IdealImage plugin component instead of <img> tags',
      recommended: false,
    },
    schema: [],
    messages: {
      image: `Do not use an \`<img>\` element to embed images. Use the \`<IdealImage />\` component from \`@theme/IdealImage\` instead. See ${docsUrl}`,
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName = (node.name as TSESTree.JSXIdentifier).name;

        console.log(elementName);
        context.report({node, messageId: 'image'});
      },
    };
  },
});
