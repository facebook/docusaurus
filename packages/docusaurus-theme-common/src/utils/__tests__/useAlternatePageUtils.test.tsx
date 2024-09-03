/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {StaticRouter} from 'react-router-dom';
import {Context} from '@docusaurus/core/src/client/docusaurusContext';
import {useAlternatePageUtils} from '../useAlternatePageUtils';
import type {DocusaurusContext} from '@docusaurus/types';

describe('useAlternatePageUtils', () => {
  const createUseAlternatePageUtilsMock =
    (context: DocusaurusContext) => (location: string) =>
      renderHook(() => useAlternatePageUtils(), {
        wrapper: ({children}) => (
          <Context.Provider value={context}>
            <StaticRouter location={location}>{children}</StaticRouter>
          </Context.Provider>
        ),
      }).result.current;
  it('works for baseUrl: / and currentLocale = defaultLocale', () => {
    const mockUseAlternatePageUtils = createUseAlternatePageUtilsMock({
      siteConfig: {baseUrl: '/', url: 'https://example.com'},
      i18n: {defaultLocale: 'en', currentLocale: 'en'},
    } as DocusaurusContext);
    expect(
      mockUseAlternatePageUtils('/').createUrl({
        locale: 'zh-Hans',
        fullyQualified: false,
      }),
    ).toBe('/zh-Hans/');
    expect(
      mockUseAlternatePageUtils('/foo').createUrl({
        locale: 'zh-Hans',
        fullyQualified: false,
      }),
    ).toBe('/zh-Hans/foo');
    expect(
      mockUseAlternatePageUtils('/foo').createUrl({
        locale: 'zh-Hans',
        fullyQualified: true,
      }),
    ).toBe('https://example.com/zh-Hans/foo');
  });

  it('works for baseUrl: / and currentLocale /= defaultLocale', () => {
    const mockUseAlternatePageUtils = createUseAlternatePageUtilsMock({
      siteConfig: {baseUrl: '/zh-Hans/', url: 'https://example.com'},
      i18n: {defaultLocale: 'en', currentLocale: 'zh-Hans'},
    } as DocusaurusContext);
    expect(
      mockUseAlternatePageUtils('/zh-Hans/').createUrl({
        locale: 'en',
        fullyQualified: false,
      }),
    ).toBe('/');
    expect(
      mockUseAlternatePageUtils('/zh-Hans/foo').createUrl({
        locale: 'en',
        fullyQualified: false,
      }),
    ).toBe('/foo');
    expect(
      mockUseAlternatePageUtils('/zh-Hans/foo').createUrl({
        locale: 'en',
        fullyQualified: true,
      }),
    ).toBe('https://example.com/foo');
  });

  it('works for non-root base URL and currentLocale = defaultLocale', () => {
    const mockUseAlternatePageUtils = createUseAlternatePageUtilsMock({
      siteConfig: {baseUrl: '/base/', url: 'https://example.com'},
      i18n: {defaultLocale: 'en', currentLocale: 'en'},
    } as DocusaurusContext);
    expect(
      mockUseAlternatePageUtils('/base/').createUrl({
        locale: 'zh-Hans',
        fullyQualified: false,
      }),
    ).toBe('/base/zh-Hans/');
    expect(
      mockUseAlternatePageUtils('/base/foo').createUrl({
        locale: 'zh-Hans',
        fullyQualified: false,
      }),
    ).toBe('/base/zh-Hans/foo');
    expect(
      mockUseAlternatePageUtils('/base/foo').createUrl({
        locale: 'zh-Hans',
        fullyQualified: true,
      }),
    ).toBe('https://example.com/base/zh-Hans/foo');
  });

  it('works for non-root base URL and currentLocale /= defaultLocale', () => {
    const mockUseAlternatePageUtils = createUseAlternatePageUtilsMock({
      siteConfig: {baseUrl: '/base/zh-Hans/', url: 'https://example.com'},
      i18n: {defaultLocale: 'en', currentLocale: 'zh-Hans'},
    } as DocusaurusContext);
    expect(
      mockUseAlternatePageUtils('/base/zh-Hans/').createUrl({
        locale: 'en',
        fullyQualified: false,
      }),
    ).toBe('/base/');
    expect(
      mockUseAlternatePageUtils('/base/zh-Hans/foo').createUrl({
        locale: 'en',
        fullyQualified: false,
      }),
    ).toBe('/base/foo');
    expect(
      mockUseAlternatePageUtils('/base/zh-Hans/foo').createUrl({
        locale: 'en',
        fullyQualified: true,
      }),
    ).toBe('https://example.com/base/foo');
  });
});
