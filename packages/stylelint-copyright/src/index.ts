/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import stylelint, {type Rule} from 'stylelint';

const ruleName = 'docusaurus/copyright-header';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'Missing copyright in the header comment',
});

type SecondaryOption = {header?: string};

const rule: Rule<boolean, string> =
  (primaryOption, secondaryOption, context) => (root, result) => {
    stylelint.utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false],
      },
      {
        actual: secondaryOption,
        possible: (v) =>
          typeof (v as SecondaryOption | undefined)?.header === 'string',
      },
    );

    if (
      root.first &&
      root.first.type === 'comment' &&
      root.first.source?.start?.column === 1
    ) {
      const {text} = root.first;
      if (text === secondaryOption.header) {
        return;
      }
    }
    if (context.fix) {
      root.first?.before(`/*${secondaryOption.header!}\n */`);
      return;
    }

    stylelint.utils.report({
      message: messages.rejected,
      node: root,
      result,
      ruleName,
    });
  };

rule.ruleName = ruleName;
rule.messages = messages;

const plugin = stylelint.createPlugin(ruleName, rule);

export = plugin;
