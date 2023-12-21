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
import {BrowserContextProvider} from '../browserContext';
import useIsBrowser from '../exports/useIsBrowser';

describe('BrowserContextProvider', () => {
  const {result, hydrate} = renderHook(() => useIsBrowser(), {
    wrapper: ({children}) => (
      <BrowserContextProvider>{children}</BrowserContextProvider>
    ),
  });
  it('has value false on first render', () => {
    expect(result.current).toBe(false);
  });
  it('has value true on hydration', () => {
    hydrate();
    expect(result.current).toBe(true);
  });
});
