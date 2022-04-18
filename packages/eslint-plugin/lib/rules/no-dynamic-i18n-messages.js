/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const {isTextLabelChild, report} = require('../../util');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce translate calls to be plain text labels',
      category: 'Possible Problems',
      url: 'https://github.com/facebook/docusaurus/tree/main/packages/eslint-plugin/docs/rules/no-dynamic-i18n-messages.md',
    },
    schema: [],
    messages: {
      translateChildren:
        '<Translate> children must be hardcoded strings. You can have in-string dynamic placeholders using the values prop.',
      translateArg:
        'translation message must be a hardcoded string. You can have in-string dynamic placeholders using the values argument.',
    },
  },

  create(context) {
    const isMessageTypeValid = (type) => type === 'Literal';

    const isNodeValid = (node) =>
      node.children.every((child) => isTextLabelChild({child}));

    return {
      "JSXElement[openingElement.name.name='Translate']": (node) => {
        if (!isNodeValid(node)) {
          report(context, node, 'translateChildren');
        }
      },
      "CallExpression > Identifier[name='translate']": (node) => {
        const messageProperty = node.parent.arguments[0].properties.find(
          (property) => property.key.name === 'message',
        );
        if (!messageProperty) {
          return;
        }

        const messageType = messageProperty.value.type;
        if (!messageType) {
          return;
        }

        if (!isMessageTypeValid(messageType)) {
          report(context, node, 'translateArg');
        }
      },
    };
  },
};
