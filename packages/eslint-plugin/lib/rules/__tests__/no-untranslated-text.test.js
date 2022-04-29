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
  valid: [
    ...getCommonValidTests(),
    {
      code: '<Component>·</Component>',
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>· </Component>',
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component> · </Component>',
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>· ·</Component>',
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>· — ×</Component>',
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>{"·"}</Component>',
      options: [{ignoreStrings: ['·']}],
    },
    {
      code: "<Component>{'·'}</Component>",
      options: [{ignoreStrings: ['·']}],
    },
    {
      code: '<Component>{`·`}</Component>',
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>Docusaurus</Component>',
      options: [{ignoreStrings: ['Docusaurus']}],
    },
    {
      code: '<Component>&#8203;</Component>',
      options: [{ignoreStrings: ['​']}],
    },
    {
      code: `<>
              {' · '}
            </>`,
      options: [{ignoreStrings: ['·', "'"]}],
    },
  ],

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
    {
      code: '<Component>· — ×</Component>',
      errors: errorsJSX,
      options: [{ignoreStrings: ['·', '—']}],
    },
    {
      code: '<Component>··</Component>',
      errors: errorsJSX,
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component> ·· </Component>',
      errors: errorsJSX,
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>"·"</Component>',
      errors: errorsJSX,
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: "<Component>'·'</Component>",
      errors: errorsJSX,
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>`·`</Component>',
      errors: errorsJSX,
      options: [{ignoreStrings: ['·', '—', '×']}],
    },
    {
      code: '<Component>Docusaurus</Component>',
      errors: errorsJSX,
      options: [{ignoreStrings: ['Docu', 'saurus']}],
    },
  ],
});
