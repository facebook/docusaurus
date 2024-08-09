/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

// Jest doesn't allow pragma below other comments. https://github.com/facebook/jest/issues/12573
// eslint-disable-next-line header/header
import React from 'react';
// TODO migrate to @testing-library/react when SSR rendering possible
// See https://github.com/testing-library/react-testing-library/issues/1120
import {renderHook} from '@testing-library/react-hooks/server';
import {DocusaurusContextProvider} from '../docusaurusContext';
import useDocusaurusContext from '../exports/useDocusaurusContext';

// This test currently isn't quite useful because the @generated aliases point
// to the empty modules. Maybe we can point that to fixtures in the future.
describe('DocusaurusContextProvider', () => {
  const {result, hydrate} = renderHook(() => useDocusaurusContext(), {
    wrapper: ({children}) => (
      <DocusaurusContextProvider>{children}</DocusaurusContextProvider>
    ),
  });
  const value = result.current;
  it('returns right value', () => {
    expect(value).toMatchInlineSnapshot(`
      {
        "codeTranslations": {},
        "globalData": {},
        "i18n": {},
        "siteConfig": {},
        "siteMetadata": {},
      }
    `);
  });
  it('has reference-equal value on hydration', () => {
    hydrate();
    expect(result.current).toBe(value);
  });
});
