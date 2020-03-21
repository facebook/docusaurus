/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const rule = require('..');

const {ruleName, messages} = rule;

testRule(rule, {
  ruleName,
  fix: false,
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
      message: messages.rejected,
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
      message: messages.rejected,
      line: 2,
      column: 1,
    },
  ],
});
