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
      url: 'https://github.com/facebook/docusaurus/tree/main/packages/eslint-plugin/docs/rules/no-untranslated-text.md',
    },
    schema: [],
    messages: {
      translateChildren:
        'All text labels in JSX should be wrapped by translate calls',
    },
  },

  create(context) {
    const isParentTranslate = (child, isParentFragment) =>
      !isParentFragment &&
      child.parent.openingElement.name.name === 'Translate';

    const isChildValid = (child, isParentFragment) => {
      if (!isTextLabelChild({child, includeWhitespace: false})) {
        return true;
      }
      return isParentTranslate(child, isParentFragment);
    };

    const isNodeValid = (node, isFragment) =>
      node.children.every((child) => isChildValid(child, isFragment));

    return {
      'JSXElement[openingElement.selfClosing=false]': (node) => {
        if (!isNodeValid(node)) {
          report(context, node, 'translateChildren');
        }
      },
      'JSXFragment[openingFragment]': (node) => {
        if (!isNodeValid(node, true)) {
          report(context, node, 'translateChildren');
        }
      },
    };
  },
};
