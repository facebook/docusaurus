/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
// TODO migrate to @testing-library/react when SSR rendering possible
// See https://github.com/testing-library/react-testing-library/issues/1120
import {renderHook} from '@testing-library/react-hooks/server';
import {RouteContextProvider} from '../../routeContext';
import useRouteContext from '../useRouteContext';

describe('useRouteContext', () => {
  it('throws when there is no route context at all', () => {
    expect(
      () => renderHook(() => useRouteContext()).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected: no Docusaurus route context found"`,
    );
  });
  it('returns merged route contexts', () => {
    expect(
      renderHook(() => useRouteContext(), {
        wrapper: ({children}) => (
          <RouteContextProvider
            value={{plugin: {id: 'test', name: 'test'}, data: {some: 'data'}}}>
            <RouteContextProvider value={{data: {someMore: 'data'}}}>
              {children}
            </RouteContextProvider>
          </RouteContextProvider>
        ),
      }).result.current,
    ).toEqual({
      data: {some: 'data', someMore: 'data'},
      plugin: {id: 'test', name: 'test'},
    });
  });
});
