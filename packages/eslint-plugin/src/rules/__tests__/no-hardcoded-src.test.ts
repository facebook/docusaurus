/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {TSESLint} from '@typescript-eslint/utils';
import rule from '../no-hardcoded-src';

declare const require: any;

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-hardcoded-src', rule, {
  valid: [
    {code: `<img src={require('./logo.png')} />`},
    {
      code: `import useBaseUrl from '@docusaurus/useBaseUrl';\n<img src={useBaseUrl('/img/logo.png')} />`,
    },
    {code: `<div src="/img/logo.png" />`},
    {code: `<img src={variableName} />`},
  ],
  invalid: [
    {
      code: `<img src="/img/logo.png" />`,
      errors: [{messageId: 'hardcodedSrc'}],
    },
    {code: `<img src="logo.png" />`, errors: [{messageId: 'hardcodedSrc'}]},
  ],
});
