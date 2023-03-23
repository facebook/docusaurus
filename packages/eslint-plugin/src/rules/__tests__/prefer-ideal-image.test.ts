/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule from '../prefer-ideal-image';
import {RuleTester} from './testUtils';

const errorsJSX = [{messageId: 'image'}] as const;

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
      code: "<IdealImage img='./path/to/img.png' />",
    },
    {
      code: "<IdealImage img={require('./path/to/img.png')} />",
    },
    {
      code: "<IdealImage img={{ src: { src: './path/to/img.png', preSrc: '', images: [{ width: 100 }]}, preSrc: './path/to/placeholder.png'}} />",
    },
  ],
  invalid: [
    {
      code: "<img src='./path/to/img.png' alt='some alt text' />",
      errors: errorsJSX,
    },
    {
      code: "<img src={require('./path/to/img.png')} alt='some alt text' />",
      errors: errorsJSX,
    },
    {
      code: "<img src='./path/to/img.png' srcset='./path/to/img-480w.jpg 480w, ./path/to/img-800w.png 800w' sizes='(max-width: 600px) 480px, 800px' alt='some alt text' />",
      errors: errorsJSX,
    },
  ],
});
