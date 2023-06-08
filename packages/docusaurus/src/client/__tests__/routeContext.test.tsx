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
import {RouteContextProvider} from '../routeContext';
import useRouteContext from '../exports/useRouteContext';

describe('RouteContextProvider', () => {
  it('creates root route context registered by plugin', () => {
    expect(
      renderHook(() => useRouteContext(), {
        wrapper: ({children}) => (
          <RouteContextProvider value={{plugin: {id: 'test', name: 'test'}}}>
            {children}
          </RouteContextProvider>
        ),
      }).result.current,
    ).toEqual({plugin: {id: 'test', name: 'test'}});
  });
  it('throws if there is no route context at all', () => {
    expect(
      () =>
        renderHook(() => useRouteContext(), {
          wrapper: ({children}) => (
            <RouteContextProvider value={null}>{children}</RouteContextProvider>
          ),
        }).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected: no Docusaurus route context found"`,
    );
  });
  it('throws if there is no parent context created by plugin', () => {
    expect(
      () =>
        renderHook(() => useRouteContext(), {
          wrapper: ({children}) => (
            <RouteContextProvider value={{data: {some: 'data'}}}>
              {children}
            </RouteContextProvider>
          ),
        }).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected: Docusaurus topmost route context has no \`plugin\` attribute"`,
    );
  });
  it('merges route context created by parent', () => {
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
  it('never overrides the plugin attribute', () => {
    expect(
      renderHook(() => useRouteContext(), {
        wrapper: ({children}) => (
          <RouteContextProvider
            value={{plugin: {id: 'test', name: 'test'}, data: {some: 'data'}}}>
            <RouteContextProvider
              value={{
                plugin: {id: 'adversary', name: 'adversary'},
                data: {someMore: 'data'},
              }}>
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
