/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loadI18n, localizePath} from '../i18n';
import {DEFAULT_I18N_CONFIG} from '../configValidation';
import path from 'path';

describe('loadI18n', () => {
  test('should load I18n for default config', async () => {
    await expect(
      loadI18n(
        // @ts-expect-error: enough for this test
        {
          i18n: DEFAULT_I18N_CONFIG,
        },
      ),
    ).resolves.toEqual({
      defaultLocale: 'en',
      locales: ['en'],
      currentLocale: 'en',
    });
  });

  test('should load I18n for multi-lang config', async () => {
    await expect(
      loadI18n(
        // @ts-expect-error: enough for this test
        {
          i18n: {
            defaultLocale: 'fr',
            locales: ['en', 'fr', 'de'],
          },
        },
      ),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'fr',
    });
  });

  test('should load I18n for multi-locale config with specified locale', async () => {
    await expect(
      loadI18n(
        // @ts-expect-error: enough for this test
        {
          i18n: {
            defaultLocale: 'fr',
            locales: ['en', 'fr', 'de'],
          },
        },
        {locale: 'de'},
      ),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
    });
  });

  test('should throw when trying to load undeclared locale', async () => {
    await expect(
      loadI18n(
        // @ts-expect-error: enough for this test
        {
          i18n: {
            defaultLocale: 'fr',
            locales: ['en', 'fr', 'de'],
          },
        },
        {locale: 'it'},
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('localizePath', () => {
  test('should localize url path with current locale', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl',
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'fr'],
          currentLocale: 'fr',
        },
        options: {localizePath: true},
      }),
    ).toEqual('/baseUrl/fr/');
  });

  test('should localize fs path with current locale', () => {
    expect(
      localizePath({
        pathType: 'fs',
        path: '/baseFsPath',
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'fr'],
          currentLocale: 'fr',
        },
        options: {localizePath: true},
      }),
    ).toEqual(`/baseFsPath${path.sep}fr${path.sep}`);
  });

  test('should localize path for default locale, if requested', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl/',
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'fr'],
          currentLocale: 'en',
        },
        options: {localizePath: true},
      }),
    ).toEqual('/baseUrl/en/');
  });

  test('should not localize path for default locale by default', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl/',
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'fr'],
          currentLocale: 'en',
        },
        // options: {localizePath: true},
      }),
    ).toEqual('/baseUrl/');
  });

  test('should localize path for non-default locale by default', () => {
    expect(
      localizePath({
        pathType: 'url',
        path: '/baseUrl/',
        i18n: {
          defaultLocale: 'en',
          locales: ['en', 'fr'],
          currentLocale: 'en',
        },
        // options: {localizePath: true},
      }),
    ).toEqual('/baseUrl/');
  });
});
