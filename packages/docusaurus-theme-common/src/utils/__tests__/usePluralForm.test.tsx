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
import {jest} from '@jest/globals';
import React from 'react';
import {renderHook} from '@testing-library/react';
import {Context} from '@docusaurus/core/src/client/docusaurusContext';
import {usePluralForm} from '../usePluralForm';
import type {DocusaurusContext} from '@docusaurus/types';

describe('usePluralForm', () => {
  const createUsePluralFormMock = (context: DocusaurusContext) => () =>
    renderHook(() => usePluralForm(), {
      wrapper: ({children}) => (
        <Context.Provider value={context}>{children}</Context.Provider>
      ),
    }).result.current;

  it('returns the right plural', () => {
    const mockUsePluralForm = createUsePluralFormMock({
      i18n: {
        currentLocale: 'en',
      },
    } as DocusaurusContext);
    expect(mockUsePluralForm().selectMessage(1, 'one|many')).toBe('one');
    expect(mockUsePluralForm().selectMessage(10, 'one|many')).toBe('many');
  });

  it('warns against too many plurals', () => {
    const mockUsePluralForm = createUsePluralFormMock({
      i18n: {
        currentLocale: 'zh-Hans',
      },
    } as DocusaurusContext);
    const consoleMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    expect(mockUsePluralForm().selectMessage(1, 'one|many')).toBe('one');
    expect(mockUsePluralForm().selectMessage(10, 'one|many')).toBe('one');
    expect(consoleMock.mock.calls[0]![0]).toMatchInlineSnapshot(
      `"For locale=zh-Hans, a maximum of 1 plural forms are expected (other), but the message contains 2: one|many"`,
    );
    consoleMock.mockRestore();
  });

  it('uses the last with not enough plurals', () => {
    const mockUsePluralForm = createUsePluralFormMock({
      i18n: {
        currentLocale: 'en',
      },
    } as DocusaurusContext);
    expect(mockUsePluralForm().selectMessage(10, 'many')).toBe('many');
  });

  it('falls back when Intl.PluralForms is not available', () => {
    const mockUsePluralForm = createUsePluralFormMock({
      i18n: {
        currentLocale: 'zh-Hans',
      },
    } as DocusaurusContext);
    const consoleMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const pluralMock = jest
      .spyOn(Intl, 'PluralRules')
      // @ts-expect-error: for testing when it doesn't exist
      .mockImplementation(() => undefined);

    expect(mockUsePluralForm().selectMessage(1, 'one|many')).toBe('one');
    expect(consoleMock.mock.calls).toHaveLength(1);
    expect(consoleMock.mock.calls[0]![0]).toMatchInlineSnapshot(`
      "Failed to use Intl.PluralRules for locale "zh-Hans".
      Docusaurus will fallback to the default (English) implementation.
      Error: pluralRules.resolvedOptions is not a function
      "
    `);

    expect(mockUsePluralForm().selectMessage(10, 'one|many')).toBe('many');
    expect(consoleMock.mock.calls).toHaveLength(2);
    expect(consoleMock.mock.calls[1]![0]).toMatchInlineSnapshot(`
      "Failed to use Intl.PluralRules for locale "zh-Hans".
      Docusaurus will fallback to the default (English) implementation.
      Error: pluralRules.resolvedOptions is not a function
      "
    `);

    consoleMock.mockRestore();
    pluralMock.mockRestore();
  });
});
