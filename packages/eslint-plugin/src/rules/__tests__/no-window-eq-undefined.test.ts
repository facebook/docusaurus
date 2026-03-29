/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule from '../no-window-eq-undefined';
import {RuleTester} from 'eslint';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-window-eq-undefined', rule, {
  valid: [
    // useIsBrowser usage — correct pattern
    {code: `const isBrowser = useIsBrowser();`},
    // ExecutionEnvironment usage — correct pattern
    {code: `if (ExecutionEnvironment.canUseDOM) { doSomething(); }`},
    // typeof checks on other things — not flagged
    {code: `typeof document !== 'undefined'`},
    {code: `typeof myVar === 'undefined'`},
    // window access without typeof — not flagged
    {code: `if (window.location) { doSomething(); }`},
  ],
  invalid: [
    {
      code: `if (typeof window !== 'undefined') { doSomething(); }`,
      errors: [{messageId: 'noWindowEqUndefined'}],
    },
    {
      code: `if (typeof window === 'undefined') { doSomething(); }`,
      errors: [{messageId: 'noWindowEqUndefined'}],
    },
    {
      code: `const isBrowser = typeof window !== 'undefined';`,
      errors: [{messageId: 'noWindowEqUndefined'}],
    },
    // Reversed operand order
    {
      code: `if ('undefined' !== typeof window) { doSomething(); }`,
      errors: [{messageId: 'noWindowEqUndefined'}],
    },
    // Double equals
    {
      code: `if (typeof window != 'undefined') { doSomething(); }`,
      errors: [{messageId: 'noWindowEqUndefined'}],
    },
  ],
});
