/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const testRule = require('stylelint-test-rule-tape');
const stylelintCopyright = require('..');

testRule(stylelintCopyright.rule, {
  ruleName: stylelintCopyright.ruleName,
  accept: [
    {
      code: `
/**
 * Copyright
 */

 .foo {}`,
    },
    {
      code: `
      /**
 * copyright
 */

 .foo {}`,
    },
  ],
  reject: [
    {
      code: `
/**
 * Copyleft
 */

 .foo {}`,
      message: `Missing copyright in the header comment (${stylelintCopyright.ruleName})`,
      line: 2,
      column: 1,
    },
    {
      code: `
/**
 * Copyleft
 */

/**
 * Copyright
 */
 .foo {}`,
      message: `Missing copyright in the header comment (${stylelintCopyright.ruleName})`,
      line: 2,
      column: 1,
    },
  ],
});
