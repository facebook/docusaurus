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

module.exports = stylelint.createPlugin(ruleName, (actual) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual,
    });

    if (!validOptions) {
      return;
    }

    root.walkComments((comment) => {
      // Ignore root comments with copyright text.
      if (
        comment === comment.parent.first &&
        /[Cc]opyright/.test(comment.text)
      ) {
        return;
      }

      // Ignore non-root comments.
      if (comment.type !== 'root' && comment !== comment.parent.first) {
        return;
      }

      // Ignore indented comments.
      if (comment.source.start.column > 1) {
        return;
      }

      stylelint.utils.report({
        message: messages.rejected,
        node: comment,
        result,
        ruleName,
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
