/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom
import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderHook} from '@testing-library/react';
import {BrowserContextProvider} from '../browserContext';
import useIsBrowser from '../exports/useIsBrowser';

describe('BrowserContextProvider', () => {
  const {result} = renderHook(() => useIsBrowser(), {
    wrapper: ({children}) => (
      <BrowserContextProvider>{children}</BrowserContextProvider>
    ),
  });

  // eslint-disable-next-line @vitest/no-commented-out-tests
  /*
   TODO it seems not really possible to test before hydration anymore
    See https://github.com/testing-library/react-testing-library/issues/1120

  it('has value false on first render', () => {
    expect(result.current).toBe(false);
  });
  it('has value true on hydration', () => {
    hydrate();
    expect(result.current).toBe(true);
  });
   */

  it('has value true', () => {
    expect(result.current).toBe(true);
  });
});
