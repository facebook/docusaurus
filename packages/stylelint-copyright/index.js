/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const stylelint = require('stylelint');

const ruleName = 'docusaurus/copyright-header';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'Missing copyright in the header comment',
});

const plugin = stylelint.createPlugin(
  ruleName,
  (primaryOption, secondaryOption, context) => (root, result) => {
    const validOptions = stylelint.utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false],
      },
      {
        actual: secondaryOption,
        possible: (v) => typeof v.header === 'string',
      },
    );

    if (!validOptions) {
      return;
    }

    if (
      root.first &&
      root.first.type === 'comment' &&
      root.first.source.start.column === 1
    ) {
      const {text} = root.first;
      if (text === secondaryOption.header) {
        return;
      }
    }
    if (context.fix) {
      root.first?.before(`/*${secondaryOption.header}\n */`);
      return;
    }

    stylelint.utils.report({
      message: messages.rejected,
      node: root,
      result,
      ruleName,
    });
  },
);

module.exports = plugin;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
