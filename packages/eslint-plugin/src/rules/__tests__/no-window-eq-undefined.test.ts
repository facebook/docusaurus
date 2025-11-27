/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule from '../no-window-eq-undefined';
import {RuleTester, getCommonValidTests} from './testUtils';

const errors = [{messageId: 'noWindowEqUndefined'}] as const;

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-window-eq-undefined', rule, {
  valid: [
    ...getCommonValidTests(),
    {
      code: `
      import useIsBrowser from '@docusaurus/useIsBrowser';

      function SomeComponent() {
        const isBrowser = useIsBrowser();
        <div>{isBrowser ? "Client" : "Server"}</div>;
      }`,
    },
    {
      code: `
      import useIsBrowser from '@docusaurus/useIsBrowser';

      function SomeComponent() {
        const isBrowser = useIsBrowser();
        const component = isBrowser ? <Client /> : <Server />;
        return <div>{component}</div>;
      }`,
    },
    {
      code: `
      function SomeComponent() {
        React.useEffect(() => {
          if(typeof window === 'undefined') {
            doSomethingForSSR();
          }
        }, []);
        return <Translate>text</Translate>;
      }`,
    },
    {
      code: `
      function SomeComponent() {
        function handleClick() {
          if (typeof window === 'undefined') {
            doSomethingForSSR();
          }
        }
        return <button onClick={handleClick}>Click me</button>;
      }`,
    },
  ],
  invalid: [
    {
      code: 'if (typeof window === "undefined") { doSomething(); }',
      errors,
    },
    {
      code: 'if (typeof window !== undefined) { doSomething(); }',
      errors,
    },
    {
      code: 'if (typeof window == "undefined") { doSomething(); }',
      errors,
    },
    {
      code: 'if (typeof window != undefined) { doSomething(); }',
      errors,
    },
    {
      code: 'if ("undefined" === typeof window) { doSomething(); }',
      errors,
    },
    {
      code: 'if ("undefined" !== typeof window) { doSomething(); }',
      errors,
    },
    {
      code: 'if (undefined == typeof window) { doSomething(); }',
      errors,
    },
    {
      code: 'if (undefined != typeof window) { doSomething(); }',
      errors,
    },
    {
      code: 'const isBrowser = typeof window === "undefined";',
      errors,
    },
    {
      code: 'const component = typeof window != "undefined" ? <Server /> : <Client />;',
      errors,
    },
    {
      code: 'return <div>{typeof window === "undefined" ? "SSR" : "CSR"}</div>;',
      errors,
    },
    {
      code: 'const isClient = typeof window !== undefined && someCheck();',
      errors,
    },
  ],
});
