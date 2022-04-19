/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const rule = require('../no-dynamic-i18n-messages');
const {RuleTester} = require('eslint');
const {getCommonValidTests} = require('../../util');

const errorsJSX = [{messageId: 'translateChildren', type: 'JSXElement'}];
const errorsFunc = [{messageId: 'translateArg', type: 'Identifier'}];

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    ecmaFeatures: {jsx: true},
  },
});
ruleTester.run('no-dynamic-i18n-messages', rule, {
  valid: [
    ...getCommonValidTests(),
    {
      code: `<Translate
                id="homepage.title"
                description="The homepage welcome message">
                  Welcome to my website
              </Translate>`,
    },
    {
      code: `<Translate
                values={{firstName: 'Sébastien'}}>
                  {'Welcome, {firstName}! How are you?'}
              </Translate>`,
    },
    {
      code: `<Translate>{'This'} is {\`valid\`}</Translate>`,
    },
    {
      code: "translate({message: 'My page meta title'})",
    },
    {
      code: "translate({message: 'The logo of site {siteName}'}, {siteName: 'Docusaurus'})",
    },
    {
      code: 'translate({otherProp: metaTitle})',
    },
    {
      code: 'translate({otherProp: `My page meta title`})',
    },
  ],

  invalid: [
    {
      code: '<Translate>{text}</Translate>',
      errors: errorsJSX,
    },
    {
      code: '<Translate>Hi {text} my friend</Translate>',
      errors: errorsJSX,
    },
    {
      code: '<Translate> {text} </Translate>',
      errors: errorsJSX,
    },
    {
      code: '<Translate>`{text}`</Translate>',
      errors: errorsJSX,
    },
    {
      // eslint-disable-next-line no-template-curly-in-string
      code: '<Translate>{`${text}`}</Translate>',
      errors: errorsJSX,
    },
    {
      code: 'translate({message: metaTitle})',
      errors: errorsFunc,
    },
  ],
});
