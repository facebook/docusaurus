import {RuleTester} from 'eslint';
import rule from '../rules/no-dynamic-i18n-messages';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {jsx: true},
  },
});

ruleTester.run('no-dynamic-i18n-messages', rule, {
  valid: [
    // Static string in translate()
    `translate({message: 'Hello'})`,
    // Static string with id
    `translate({message: 'Hello', id: 'greeting'})`,
    // Static template literal
    'translate({message: `Hello`})',
  ],
  invalid: [
    {
      code: `translate({message: variable})`,
      errors: [{messageId: 'dynamicMessage'}],
    },
    {
      code: 'translate({message: `Hello ${name}`})',
      errors: [{messageId: 'dynamicMessage'}],
    },
    {
      code: `translate({id: variable, message: 'Hello'})`,
      errors: [{messageId: 'dynamicId'}],
    },
  ],
});
