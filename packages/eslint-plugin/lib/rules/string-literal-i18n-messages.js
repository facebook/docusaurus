/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
  isTextLabelChild,
  report,
  isStringWithoutExpressions,
} = require('../util');

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce translate APIs to be called on plain text labels',
      category: 'Possible Problems',
      url: 'https://docusaurus.io/docs/api/misc/@docusaurus/eslint-plugin/string-literal-i18n-messages',
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

        if (
          !isStringWithoutExpressions({
            text: messageProperty.value,
          })
        ) {
          report(context, node, 'translateArg');
        }
      },
    };
  },
};
