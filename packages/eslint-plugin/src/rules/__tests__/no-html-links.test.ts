/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule from '../no-html-links';
import {RuleTester} from './testUtils';

const errorsJSX = [{messageId: 'link'}] as const;

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('prefer-docusaurus-link', rule, {
  valid: [
    {
      code: '<Link to="/test">test</Link>',
    },
    {
      code: '<Link to="https://twitter.com/docusaurus">Twitter</Link>',
    },
  ],
  invalid: [
    {
      code: '<a href="/test">test</a>',
      errors: errorsJSX,
    },
    {
      code: '<a href="https://twitter.com/docusaurus" target="_blank">test</a>',
      errors: errorsJSX,
    },
    {
      code: '<a href="https://twitter.com/docusaurus" target="_blank" rel="noopener noreferrer">test</a>',
      errors: errorsJSX,
    },
  ],
});
