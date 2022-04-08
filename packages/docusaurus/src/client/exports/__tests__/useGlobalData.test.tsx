/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import useGlobalData, {
  useAllPluginInstancesData,
  usePluginData,
} from '../useGlobalData';
import {Context} from '../../docusaurusContext';

describe('useGlobalData', () => {
  it('returns global data from context', () => {
    expect(
      renderHook(() => useGlobalData(), {
        wrapper: ({children}) => (
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          <Context.Provider value={{globalData: {foo: 'bar'}}}>
            {children}
          </Context.Provider>
        ),
      }).result.current,
    ).toEqual({foo: 'bar'});
  });

  it('throws when global data not found', () => {
    // Can it actually happen?
    expect(
      () =>
        renderHook(() => useGlobalData(), {
          wrapper: ({children}) => (
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            <Context.Provider value={{}}>{children}</Context.Provider>
          ),
        }).result.current,
    ).toThrowErrorMatchingInlineSnapshot(`"Docusaurus global data not found."`);
  });
});

describe('useAllPluginInstancesData', () => {
  it('returns plugin data namespace', () => {
    expect(
      renderHook(() => useAllPluginInstancesData('foo'), {
        wrapper: ({children}) => (
          <Context.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{globalData: {foo: {default: 'default', bar: 'bar'}}}}>
            {children}
          </Context.Provider>
        ),
      }).result.current,
    ).toEqual({default: 'default', bar: 'bar'});
  });

  it('throws when plugin data not found', () => {
    expect(
      () =>
        renderHook(() => useAllPluginInstancesData('bar'), {
          wrapper: ({children}) => (
            <Context.Provider
              // eslint-disable-next-line react/jsx-no-constructed-context-values
              value={{globalData: {foo: {default: 'default', bar: 'bar'}}}}>
              {children}
            </Context.Provider>
          ),
        }).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus plugin global data not found for "bar" plugin."`,
    );
  });
});

describe('usePluginData', () => {
  it('returns plugin instance data', () => {
    expect(
      renderHook(() => usePluginData('foo', 'bar'), {
        wrapper: ({children}) => (
          <Context.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{globalData: {foo: {default: 'default', bar: 'bar'}}}}>
            {children}
          </Context.Provider>
        ),
      }).result.current,
    ).toBe('bar');
  });

  it('defaults to default ID', () => {
    expect(
      renderHook(() => usePluginData('foo'), {
        wrapper: ({children}) => (
          <Context.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{globalData: {foo: {default: 'default', bar: 'bar'}}}}>
            {children}
          </Context.Provider>
        ),
      }).result.current,
    ).toBe('default');
  });

  it('throws when plugin instance data not found', () => {
    expect(
      () =>
        renderHook(() => usePluginData('foo', 'baz'), {
          wrapper: ({children}) => (
            <Context.Provider
              // eslint-disable-next-line react/jsx-no-constructed-context-values
              value={{globalData: {foo: {default: 'default', bar: 'bar'}}}}>
              {children}
            </Context.Provider>
          ),
        }).result.current,
    ).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus plugin global data not found for "foo" plugin with id "baz"."`,
    );
  });
});
