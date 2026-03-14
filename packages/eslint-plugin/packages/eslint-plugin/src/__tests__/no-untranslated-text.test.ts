import {RuleTester} from 'eslint';
import rule from '../rules/no-untranslated-text';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {jsx: true},
  },
});

ruleTester.run('no-untranslated-text', rule, {
  valid: [
    // Text inside Translate
    `<Translate>Hello World</Translate>`,
    // Whitespace only
    `<div>   </div>`,
    // Inside code block
    `<code>some text here</code>`,
    // Numbers only
    `<div>123</div>`,
  ],
  invalid: [
    {
      code: `<div>Hello World</div>`,
      errors: [{messageId: 'untranslatedText'}],
    },
    {
      code: `<p>This needs translation</p>`,
      errors: [{messageId: 'untranslatedText'}],
    },
  ],
});
