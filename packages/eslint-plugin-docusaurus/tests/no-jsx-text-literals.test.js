'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../lib/rules/no-jsx-text-literals');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
});

ruleTester.run('no-jsx-text-literals', rule, {
  valid: [
    // using Translate component
    { code: "const a = <Translate>Hello</Translate>;" },
    // whitespace-only
    { code: "const a = <div>   </div>;" },
    // code/pre tags
    { code: "const a = <pre>some code</pre>;" },
    // dynamic expression
    { code: "const a = <div>{message}</div>;" },
  ],
  invalid: [
    {
      code: "const a = <div>Hello world</div>;",
      errors: [{ messageId: 'noJsxText' }],
    },
    {
      code: "const a = <p>{'Plain text'}</p>;",
      errors: [{ messageId: 'noJsxText' }],
    },
  ],
});
