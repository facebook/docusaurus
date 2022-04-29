/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {isTextLabelChild, report} = require('../util');

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce text labels in JSX to be wrapped by translate calls',
      category: 'Suggestions',
      url: 'https://docusaurus.io/docs/api/misc/@docusaurus/eslint-plugin/no-untranslated-text',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreStrings: {
            type: 'array',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      translateChildren:
        'All text labels in JSX should be wrapped by translate calls',
    },
  },

  create(context) {
    const stringsToIgnore = context.options[0]?.ignoreStrings ?? [];

    const isParentTranslate = ({child, isParentFragment}) =>
      !isParentFragment &&
      child.parent.openingElement.name.name === 'Translate';

    const isChildValid = ({child, isParentFragment}) => {
      if (!isTextLabelChild({child, ignoreWhitespace: true, stringsToIgnore})) {
        return true;
      }
      return isParentTranslate({child, isParentFragment});
    };

    const isNodeValid = ({node, isFragment = false} = {}) =>
      node.children.every((child) =>
        isChildValid({child, isParentFragment: isFragment}),
      );

    return {
      'JSXElement[openingElement.selfClosing=false]': (node) => {
        if (!isNodeValid({node})) {
          report(context, node, 'translateChildren');
        }
      },
      'JSXFragment[openingFragment]': (node) => {
        if (!isNodeValid({node, isFragment: true})) {
          report(context, node, 'translateChildren');
        }
      },
    };
  },
};
