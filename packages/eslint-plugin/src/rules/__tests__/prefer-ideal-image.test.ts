/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule from '../prefer-ideal-image';
import {RuleTester} from './testUtils';

const errorsJSX = [{messageId: 'idealImage'}] as const;

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
      code: '<Image src={thumbnail}/>',
    },
    {
      code: "<Image src='path/to/image'/>",
    },
  ],
  invalid: [
    {
      code: '<img sec={thumbnail} />',
      errors: errorsJSX,
    },
    {
      code: "<img sec='path/to/image' />",
      errors: errorsJSX,
    },
  ],
});
