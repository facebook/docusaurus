/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  loadI18n,
  localizePath,
  getDefaultLocaleConfig,
  shouldWarnAboutNodeVersion,
} from '../i18n';
import {DEFAULT_I18N_CONFIG} from '../configValidation';
import path from 'path';
import {chain, identity} from 'lodash';
import {I18nConfig} from '@docusaurus/types';

function testLocaleConfigsFor(locales: string[]) {
  return chain(locales)
    .keyBy(identity)
    .mapValues(getDefaultLocaleConfig)
    .value();
}

function loadI18nTest(i18nConfig: I18nConfig, locale?: string) {
  return loadI18n(
    // @ts-expect-error: enough for this test
    {
      i18n: i18nConfig,
    },
    {locale},
  );
}

describe('defaultLocaleConfig', () => {
  // @ts-expect-error: wait for TS support of ES2021 feature
  const canComputeLabel = typeof Intl.DisplayNames !== 'undefined';

  test('returns correct labels', () => {
    expect(getDefaultLocaleConfig('fr')).toEqual({
      label: canComputeLabel ? 'français' : 'fr',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('fr-FR')).toEqual({
      label: canComputeLabel ? 'français (France)' : 'fr-FR',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('en')).toEqual({
      label: canComputeLabel ? 'English' : 'en',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: canComputeLabel ? 'American English' : 'en-US',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('zh')).toEqual({
      label: canComputeLabel ? '中文' : 'zh',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('zh-CN')).toEqual({
      label: canComputeLabel ? '中文（中国）' : 'zh-CN',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: canComputeLabel ? 'American English' : 'en-US',
      direction: 'ltr',
    });
    expect(getDefaultLocaleConfig('fa')).toEqual({
      label: canComputeLabel ? 'فارسی' : 'fa',
      direction: 'rtl',
    });
    expect(getDefaultLocaleConfig('fa-IR')).toEqual({
      label: canComputeLabel ? 'فارسی (ایران)' : 'fa-IR',
      direction: 'rtl',
    });
  });
});

describe('shouldWarnAboutNodeVersion', () => {
  test('warns for old NodeJS version and [en,fr]', () => {
    expect(shouldWarnAboutNodeVersion(12, ['en', 'fr'])).toEqual(true);
  });

  test('not warn for old NodeJS version and [en]', () => {
    expect(shouldWarnAboutNodeVersion(12, ['en'])).toEqual(false);
  });

  test('not warn for recent NodeJS version and [en,fr]', () => {
    expect(shouldWarnAboutNodeVersion(14, ['en', 'fr'])).toEqual(false);
  });
});

describe('loadI18n', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  test('should load I18n for default config', async () => {
    await expect(loadI18nTest(DEFAULT_I18N_CONFIG)).resolves.toEqual({
      defaultLocale: 'en',
      locales: ['en'],
      currentLocale: 'en',
      localeConfigs: testLocaleConfigsFor(['en']),
    });
  });

  test('should load I18n for multi-lang config', async () => {
    await expect(
      loadI18nTest({
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      }),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'fr',
      localeConfigs: testLocaleConfigsFor(['en', 'fr', 'de']),
    });
  });

  test('should load I18n for multi-locale config with specified locale', async () => {
    await expect(
      loadI18nTest(
        {
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {},
        },
        'de',
      ),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: testLocaleConfigsFor(['en', 'fr', 'de']),
    });
  });

  test('should load I18n for multi-locale config with some xcustom locale configs', async () => {
    await expect(
      loadI18nTest(
        {
          defaultLocale: 'fr',
          locales: ['en', 'fr', 'de'],
          localeConfigs: {
            fr: {label: 'Français'},
            en: {},
          },
        },
        'de',
      ),
    ).resolves.toEqual({
      defaultLocale: 'fr',
      locales: ['en', 'fr', 'de'],
      currentLocale: 'de',
      localeConfigs: {
        fr: {label: 'Français', direction: 'ltr'},
        en: getDefaultLocaleConfig('en'),
        de: getDefaultLocaleConfig('de'),
      },
    });
  });

  test('should warn when trying to load undeclared locale', async () => {
    await loadI18nTest(
      {
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      },
      'it',
    );
    expect(consoleSpy.mock.calls[0][0]).toMatch(
      /The locale=it was not found in your site configuration/,
    );
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
          localeConfigs: {},
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
          localeConfigs: {},
        },
        options: {localizePath: true},
      }),
    ).toEqual(`${path.sep}baseFsPath${path.sep}fr${path.sep}`);
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
          localeConfigs: {},
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
          localeConfigs: {},
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
          localeConfigs: {},
        },
        // options: {localizePath: true},
      }),
    ).toEqual('/baseUrl/');
  });
});
