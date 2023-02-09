/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import useBaseUrl, {useBaseUrlUtils} from '../useBaseUrl';
import {Context} from '../../docusaurusContext';
import type {DocusaurusContext} from '@docusaurus/types';
import type {BaseUrlOptions} from '@docusaurus/useBaseUrl';

const forcePrepend = {forcePrependBaseUrl: true};

describe('useBaseUrl', () => {
  const createUseBaseUrlMock =
    (context: DocusaurusContext) => (url: string, options?: BaseUrlOptions) =>
      renderHook(() => useBaseUrl(url, options), {
        wrapper: ({children}) => (
          <Context.Provider value={context}>{children}</Context.Provider>
        ),
      }).result.current;
  it('works with empty base URL', () => {
    const mockUseBaseUrl = createUseBaseUrlMock({
      siteConfig: {
        baseUrl: '/',
        url: 'https://docusaurus.io',
      },
    } as DocusaurusContext);

    expect(mockUseBaseUrl('hello')).toBe('/hello');
    expect(mockUseBaseUrl('/hello')).toBe('/hello');
    expect(mockUseBaseUrl('hello/')).toBe('/hello/');
    expect(mockUseBaseUrl('/hello/')).toBe('/hello/');
    expect(mockUseBaseUrl('hello/foo')).toBe('/hello/foo');
    expect(mockUseBaseUrl('/hello/foo')).toBe('/hello/foo');
    expect(mockUseBaseUrl('hello/foo/')).toBe('/hello/foo/');
    expect(mockUseBaseUrl('/hello/foo/')).toBe('/hello/foo/');
    expect(mockUseBaseUrl('https://github.com')).toBe('https://github.com');
    expect(mockUseBaseUrl('//reactjs.org')).toBe('//reactjs.org');
    expect(mockUseBaseUrl('//reactjs.org', forcePrepend)).toBe('//reactjs.org');
    expect(mockUseBaseUrl('https://site.com', forcePrepend)).toBe(
      'https://site.com',
    );
    expect(mockUseBaseUrl('/hello/foo', {absolute: true})).toBe(
      'https://docusaurus.io/hello/foo',
    );
    expect(mockUseBaseUrl('#hello')).toBe('#hello');
  });

  it('works with non-empty base URL', () => {
    const mockUseBaseUrl = createUseBaseUrlMock({
      siteConfig: {
        baseUrl: '/docusaurus/',
        url: 'https://docusaurus.io',
      },
    } as DocusaurusContext);

    expect(mockUseBaseUrl('')).toBe('');
    expect(mockUseBaseUrl('hello')).toBe('/docusaurus/hello');
    expect(mockUseBaseUrl('/hello')).toBe('/docusaurus/hello');
    expect(mockUseBaseUrl('hello/')).toBe('/docusaurus/hello/');
    expect(mockUseBaseUrl('/hello/')).toBe('/docusaurus/hello/');
    expect(mockUseBaseUrl('hello/foo')).toBe('/docusaurus/hello/foo');
    expect(mockUseBaseUrl('/hello/foo')).toBe('/docusaurus/hello/foo');
    expect(mockUseBaseUrl('hello/foo/')).toBe('/docusaurus/hello/foo/');
    expect(mockUseBaseUrl('/hello/foo/')).toBe('/docusaurus/hello/foo/');
    expect(mockUseBaseUrl('https://github.com')).toBe('https://github.com');
    expect(mockUseBaseUrl('//reactjs.org')).toBe('//reactjs.org');
    expect(mockUseBaseUrl('//reactjs.org', forcePrepend)).toBe('//reactjs.org');
    expect(mockUseBaseUrl('/hello', forcePrepend)).toBe('/docusaurus/hello');
    expect(mockUseBaseUrl('https://site.com', forcePrepend)).toBe(
      'https://site.com',
    );
    expect(mockUseBaseUrl('/hello/foo', {absolute: true})).toBe(
      'https://docusaurus.io/docusaurus/hello/foo',
    );
    expect(mockUseBaseUrl('/docusaurus')).toBe('/docusaurus/');
    expect(mockUseBaseUrl('/docusaurus/')).toBe('/docusaurus/');
    expect(mockUseBaseUrl('/docusaurus/hello')).toBe('/docusaurus/hello');
    expect(mockUseBaseUrl('#hello')).toBe('#hello');
  });
});

describe('useBaseUrlUtils().withBaseUrl()', () => {
  const mockUseBaseUrlUtils = (context: DocusaurusContext) =>
    renderHook(() => useBaseUrlUtils(), {
      wrapper: ({children}) => (
        <Context.Provider value={context}>{children}</Context.Provider>
      ),
    }).result.current;
  it('empty base URL', () => {
    const {withBaseUrl} = mockUseBaseUrlUtils({
      siteConfig: {
        baseUrl: '/',
        url: 'https://docusaurus.io',
      },
    } as DocusaurusContext);

    expect(withBaseUrl('hello')).toBe('/hello');
    expect(withBaseUrl('/hello')).toBe('/hello');
    expect(withBaseUrl('hello/')).toBe('/hello/');
    expect(withBaseUrl('/hello/')).toBe('/hello/');
    expect(withBaseUrl('hello/foo')).toBe('/hello/foo');
    expect(withBaseUrl('/hello/foo')).toBe('/hello/foo');
    expect(withBaseUrl('hello/foo/')).toBe('/hello/foo/');
    expect(withBaseUrl('/hello/foo/')).toBe('/hello/foo/');
    expect(withBaseUrl('https://github.com')).toBe('https://github.com');
    expect(withBaseUrl('//reactjs.org')).toBe('//reactjs.org');
    expect(withBaseUrl('//reactjs.org', forcePrepend)).toBe('//reactjs.org');
    expect(withBaseUrl('https://site.com', forcePrepend)).toBe(
      'https://site.com',
    );
    expect(withBaseUrl('/hello/foo', {absolute: true})).toBe(
      'https://docusaurus.io/hello/foo',
    );
    expect(withBaseUrl('#hello')).toBe('#hello');
  });

  it('non-empty base URL', () => {
    const {withBaseUrl} = mockUseBaseUrlUtils({
      siteConfig: {
        baseUrl: '/docusaurus/',
        url: 'https://docusaurus.io',
      },
    } as DocusaurusContext);

    expect(withBaseUrl('hello')).toBe('/docusaurus/hello');
    expect(withBaseUrl('/hello')).toBe('/docusaurus/hello');
    expect(withBaseUrl('hello/')).toBe('/docusaurus/hello/');
    expect(withBaseUrl('/hello/')).toBe('/docusaurus/hello/');
    expect(withBaseUrl('hello/foo')).toBe('/docusaurus/hello/foo');
    expect(withBaseUrl('/hello/foo')).toBe('/docusaurus/hello/foo');
    expect(withBaseUrl('hello/foo/')).toBe('/docusaurus/hello/foo/');
    expect(withBaseUrl('/hello/foo/')).toBe('/docusaurus/hello/foo/');
    expect(withBaseUrl('https://github.com')).toBe('https://github.com');
    expect(withBaseUrl('//reactjs.org')).toBe('//reactjs.org');
    expect(withBaseUrl('//reactjs.org', forcePrepend)).toBe('//reactjs.org');
    expect(withBaseUrl('https://site.com', forcePrepend)).toBe(
      'https://site.com',
    );
    expect(withBaseUrl('/hello/foo', {absolute: true})).toBe(
      'https://docusaurus.io/docusaurus/hello/foo',
    );
    expect(withBaseUrl('/docusaurus')).toBe('/docusaurus/');
    expect(withBaseUrl('/docusaurus/')).toBe('/docusaurus/');
    expect(withBaseUrl('/docusaurus/hello')).toBe('/docusaurus/hello');
    expect(withBaseUrl('#hello')).toBe('#hello');
  });
});
