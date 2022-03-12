/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {loadI18n, localizePath, getDefaultLocaleConfig} from '../i18n';
import {DEFAULT_I18N_CONFIG} from '../configValidation';
import path from 'path';
import type {I18nConfig} from '@docusaurus/types';

function testLocaleConfigsFor(locales: string[]) {
  return Object.fromEntries(
    locales.map((locale) => [locale, getDefaultLocaleConfig(locale)]),
  );
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
  const canComputeLabel = typeof Intl.DisplayNames !== 'undefined';

  it('returns correct labels', () => {
    expect(getDefaultLocaleConfig('fr')).toEqual({
      label: canComputeLabel ? 'Français' : 'fr',
      direction: 'ltr',
      htmlLang: 'fr',
    });
    expect(getDefaultLocaleConfig('fr-FR')).toEqual({
      label: canComputeLabel ? 'Français (France)' : 'fr-FR',
      direction: 'ltr',
      htmlLang: 'fr-FR',
    });
    expect(getDefaultLocaleConfig('en')).toEqual({
      label: canComputeLabel ? 'English' : 'en',
      direction: 'ltr',
      htmlLang: 'en',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: canComputeLabel ? 'American English' : 'en-US',
      direction: 'ltr',
      htmlLang: 'en-US',
    });
    expect(getDefaultLocaleConfig('zh')).toEqual({
      label: canComputeLabel ? '中文' : 'zh',
      direction: 'ltr',
      htmlLang: 'zh',
    });
    expect(getDefaultLocaleConfig('zh-CN')).toEqual({
      label: canComputeLabel ? '中文（中国）' : 'zh-CN',
      direction: 'ltr',
      htmlLang: 'zh-CN',
    });
    expect(getDefaultLocaleConfig('en-US')).toEqual({
      label: canComputeLabel ? 'American English' : 'en-US',
      direction: 'ltr',
      htmlLang: 'en-US',
    });
    expect(getDefaultLocaleConfig('fa')).toEqual({
      label: canComputeLabel ? 'فارسی' : 'fa',
      direction: 'rtl',
      htmlLang: 'fa',
    });
    expect(getDefaultLocaleConfig('fa-IR')).toEqual({
      label: canComputeLabel ? 'فارسی (ایران)' : 'fa-IR',
      direction: 'rtl',
      htmlLang: 'fa-IR',
    });
  });
});

describe('loadI18n', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it('loads I18n for default config', async () => {
    await expect(loadI18nTest(DEFAULT_I18N_CONFIG)).resolves.toEqual({
      defaultLocale: 'en',
      locales: ['en'],
      currentLocale: 'en',
      localeConfigs: testLocaleConfigsFor(['en']),
    });
  });

  it('loads I18n for multi-lang config', async () => {
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

  it('loads I18n for multi-locale config with specified locale', async () => {
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

  it('loads I18n for multi-locale config with some xcustom locale configs', async () => {
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
        fr: {label: 'Français', direction: 'ltr', htmlLang: 'fr'},
        en: getDefaultLocaleConfig('en'),
        de: getDefaultLocaleConfig('de'),
      },
    });
  });

  it('warns when trying to load undeclared locale', async () => {
    await loadI18nTest(
      {
        defaultLocale: 'fr',
        locales: ['en', 'fr', 'de'],
        localeConfigs: {},
      },
      'it',
    );
    expect(consoleSpy.mock.calls[0][0]).toMatch(
      /The locale .*it.* was not found in your site configuration/,
    );
  });
});

describe('localizePath', () => {
  it('localizes url path with current locale', () => {
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

  it('localizes fs path with current locale', () => {
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
    ).toEqual(`${path.sep}baseFsPath${path.sep}fr`);
  });

  it('localizes path for default locale, if requested', () => {
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

  it('does not localize path for default locale by default', () => {
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

  it('localizes path for non-default locale by default', () => {
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
