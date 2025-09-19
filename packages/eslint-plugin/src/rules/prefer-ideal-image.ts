/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRule} from '../util';
import type {TSESTree} from '@typescript-eslint/types/dist/ts-estree';

type Options = [];
type MessageIds = 'idealImage';

export default createRule<Options, MessageIds>({
  name: 'prefer-ideal-image',
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce using Docusaurus theme idealImage component instead of <img> tag',
      recommended: false,
    },
    schema: [],
    messages: {
      idealImage:
        'Do not use the `<img>` tag for images. Use the `<Image />` component from `@theme/IdealImage` instead.',
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

        context.report({node, messageId: 'idealImage'});
      },
    };
  },
});
