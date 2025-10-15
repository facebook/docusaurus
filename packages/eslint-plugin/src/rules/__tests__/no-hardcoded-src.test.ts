/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {ESLintUtils} from '@typescript-eslint/utils';
import noHardcodedSrcRule from '../no-hardcoded-src';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-hardcoded-src', noHardcodedSrcRule, {
  valid: [
    {
      code: `<img src={dynamicSource} />`,
    },
    {
      code: `<img src={useBaseUrl('img/logo.png')} />`,
    },
  ],
  invalid: [
    {
      code: `<img src="https://example.com/image.png" />`,
      errors: [{messageId: 'noHardcodedSrc'}],
    },
  ],
});
