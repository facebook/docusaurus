/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const testRule = require('stylelint-test-rule-tape');
const selectorCopyright = require('..');

testRule(selectorCopyright.rule, {
  ruleName: selectorCopyright.ruleName,
  config: [true],
  accept: [
    {
      code: '/**\n* Copyright',
      description: 'Copyright in the first comment',
    },
    {
      code: '/**\n* copyright',
      description: 'Copyright in the first comment',
    },
  ],
  reject: [
    {
      code: '/**\n* Hello',
      message: 'Missing copyright in the first comment',
      line: 2,
      column: 3,
    },
  ],
});
