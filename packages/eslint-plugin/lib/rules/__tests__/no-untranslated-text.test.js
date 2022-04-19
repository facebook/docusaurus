/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const rule = require('../no-untranslated-text');
const {RuleTester} = require('eslint');
const {getCommonValidTests} = require('../../util');

const errorsJSX = [{messageId: 'translateChildren', type: 'JSXElement'}];
const errorsJSXFragment = [
  {messageId: 'translateChildren', type: 'JSXFragment'},
];

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    ecmaFeatures: {jsx: true},
  },
});
ruleTester.run('no-untranslated-text', rule, {
  valid: [...getCommonValidTests()],

  invalid: [
    {
      code: '<Component>text</Component>',
      errors: errorsJSX,
    },
    {
      code: '<Component> text </Component>',
      errors: errorsJSX,
    },
    {
      code: '<Component>"text"</Component>',
      errors: errorsJSX,
    },
    {
      code: "<Component>'text'</Component>",
      errors: errorsJSX,
    },
    {
      code: '<Component>`text`</Component>',
      errors: errorsJSX,
    },
    {
      code: '<Component>{"text"}</Component>',
      errors: errorsJSX,
    },
    {
      code: "<Component>{'text'}</Component>",
      errors: errorsJSX,
    },
    {
      code: '<Component>{`text`}</Component>',
      errors: errorsJSX,
    },
    {
      code: '<>text</>',
      errors: errorsJSXFragment,
    },
  ],
});
