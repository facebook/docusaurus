/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule from '../prefer-ideal-image';
import {RuleTester} from './testUtils';

const errorMsg = [{messageId: 'idealImageError'}] as const;
const errorWarning = [{messageId: 'idealImageWarning'}] as const;

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('prefer-ideal-image', rule, {
  valid: [
    {
      code: "<IdealImage img='./path.to/img.png' />",
    },
    {
      code: "<IdealImage img={require('./path/to/img.png')} />",
    },
    {
      code: "<img src='https://example.com/logo.png' />",
    },
    {
      code: '<img src={`https://achintya-rai.com/x/${handle}`} />',
    },
    {
      code: '<img src={props.src} />',
    },
    {
      code: '<img src={someVariable} />',
    },
    {
      code: "<img src='./img.svg' />",
    },
  ],
  invalid: [
    {
      code: "<img src={require('./img.png')} />",
      errors: errorMsg,
    },
    {
      code: "<img src='./img.png' />",
      errors: errorWarning,
    },
    {
      code: "<img src='/static/img.png' />",
      errors: errorWarning,
    },
    {
      code: "<img src='../parent.png' />",
      errors: errorWarning,
    },
  ],
});
